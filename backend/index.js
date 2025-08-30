require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios"); 
const PORT = process.env.PORT || 8080;
const MONGODB_CONNECT_LINK = process.env.MONGODB_URL;
const cors = require("cors");

// Import your models
const holding = require("./Models/HoldingModel");
const position = require("./Models/PositionModel");
const order = require("./Models/Order");

// Import auth routes
const authRoutes = require("./routes/authRoutes");

const orderRoutes = require("./routes/order");
const nodemailer = require("nodemailer");
// Middleware
// Make sure your CORS is configured properly
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://tranquvest-app.onrender.com", "https://tranquvest-dashboard.onrender.com"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dashboard routes first
app.use("/dashboard", express.static(path.join(__dirname, "dashboard/build")));
app.get("/dashboard/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/build/index.html"));
});

// Frontend routes last
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});



// Add this after your CORS configuration
app.use('/uploads', express.static('uploads'));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const main = async () => {
    await mongoose.connect(MONGODB_CONNECT_LINK);
};

main()
    .then(() => {
        console.log("✅ Successfully Connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    });

// Auth routes
app.use("/api/auth", authRoutes);

// Your existing trading routes
app.get("/holdings", async (req, res) => {
    try {
        const allHoldings = await holding.find({});
        res.json(allHoldings);
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/positions", async (req, res) => {
    try {
        let allPositions = await position.find({});
        res.json(allPositions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.get('/api/quote', async (req, res) => {
    const { symbol, apikey } = req.query;
    
    try {
        console.log(`Fetching quote for symbol: ${symbol}`);
        
        const response = await axios.get('https://api.twelvedata.com/quote', {
            params: { symbol, apikey }
        });
        
        console.log(`Quote response for ${symbol}:`, response.data);
        res.json(response.data);
        
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error.response?.data || error.message);
        
        if (error.response?.status === 404) {
            res.status(404).json({ 
                error: 'Symbol not found', 
                message: `Symbol '${symbol}' is not available or incorrectly formatted.`,
                suggestion: 'Try using format like SYMBOL.NSE (e.g., SBIN.NSE) for Indian stocks'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch stock data',
                message: error.response?.data?.message || error.message
            });
        }
    }
});

app.get('/api/test-symbol/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apikey = req.query.apikey || 'demo';
    
    try {
        console.log(`Testing symbol: ${symbol}`);
        
        const response = await axios.get('https://api.twelvedata.com/quote', {
            params: { symbol, apikey }
        });
        
        if (response.data.status === 'error') {
            res.status(400).json({
                symbol: symbol,
                status: 'Invalid',
                error: response.data.message
            });
        } else {
            res.json({
                symbol: symbol,
                status: 'Valid',
                name: response.data.name,
                price: response.data.close
            });
        }
        
    } catch (error) {
        res.status(400).json({
            symbol: symbol,
            status: 'Invalid',
            error: error.response?.data?.message || error.message
        });
    }
});

// Add after your existing routes

// NSE API Proxy Route
app.get('/api/nse-quote/:symbol', async (req, res) => {
    const { symbol } = req.params;
    
    try {
        console.log(`🔄 Backend fetching NSE data for: ${symbol}`);
        
        // First, visit NSE homepage to get cookies
        const homeResponse = await axios.get('https://www.nseindia.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
        });
        
        // Extract cookies
        const cookies = homeResponse.headers['set-cookie'];
        const cookieString = cookies ? cookies.map(cookie => cookie.split(';')[0]).join('; ') : '';
        
        // Now make the actual API request with cookies
        const response = await axios.get('https://www.nseindia.com/api/quote-equity', {
            params: { symbol: symbol.toUpperCase() },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.nseindia.com/get-quotes/equity',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': cookieString,
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            },
            timeout: 15000
        });

        if (response.data && response.data.info) {
            const quote = {
                symbol: response.data.info.symbol,
                name: response.data.info.companyName,
                currentPrice: parseFloat(response.data.priceInfo.lastPrice || 0),
                open: parseFloat(response.data.priceInfo.open || 0),
                high: parseFloat(response.data.priceInfo.intraDayHighLow?.max || 0),
                low: parseFloat(response.data.priceInfo.intraDayHighLow?.min || 0),
                previousClose: parseFloat(response.data.priceInfo.previousClose || 0),
                change: parseFloat(response.data.priceInfo.change || 0),
                changePercent: parseFloat(response.data.priceInfo.pChange || 0),
                volume: parseInt(response.data.priceInfo.totalTradedVolume || 0),
                timestamp: new Date().toISOString(),
                currency: 'INR',
                exchange: 'NSE',
                isRealData: true
            };
            
            console.log(`✅ Real NSE data fetched for ${symbol}: ₹${quote.currentPrice}`);
            res.json(quote);
        } else {
            throw new Error('Invalid NSE response format');
        }
        
    } catch (error) {
        console.error(`❌ NSE API error for ${symbol}:`, error.message);
        
        // Return dummy data as fallback
        const dummyData = getDummyQuote(symbol);
        res.json(dummyData);
    }
});

// Batch NSE quotes endpoint
app.post('/api/nse-quotes', async (req, res) => {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
        return res.status(400).json({ error: 'Symbols array required' });
    }
    
    const results = {};
    
    // Get homepage cookies once
    let cookieString = '';
    try {
        const homeResponse = await axios.get('https://www.nseindia.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const cookies = homeResponse.headers['set-cookie'];
        cookieString = cookies ? cookies.map(cookie => cookie.split(';')[0]).join('; ') : '';
    } catch (error) {
        console.error('Failed to get NSE cookies:', error.message);
    }
    
    // Process symbols one by one
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        
        try {
            const response = await axios.get('https://www.nseindia.com/api/quote-equity', {
                params: { symbol: symbol.toUpperCase() },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': 'https://www.nseindia.com/get-quotes/equity',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': cookieString
                },
                timeout: 10000
            });

            if (response.data && response.data.info) {
                results[symbol] = {
                    symbol: response.data.info.symbol,
                    name: response.data.info.companyName,
                    currentPrice: parseFloat(response.data.priceInfo.lastPrice || 0),
                    open: parseFloat(response.data.priceInfo.open || 0),
                    high: parseFloat(response.data.priceInfo.intraDayHighLow?.max || 0),
                    low: parseFloat(response.data.priceInfo.intraDayHighLow?.min || 0),
                    previousClose: parseFloat(response.data.priceInfo.previousClose || 0),
                    change: parseFloat(response.data.priceInfo.change || 0),
                    changePercent: parseFloat(response.data.priceInfo.pChange || 0),
                    volume: parseInt(response.data.priceInfo.totalTradedVolume || 0),
                    timestamp: new Date().toISOString(),
                    currency: 'INR',
                    exchange: 'NSE',
                    isRealData: true
                };
                console.log(`✅ Real data: ${symbol} = ₹${results[symbol].currentPrice}`);
            }
        } catch (error) {
            console.error(`❌ Failed to fetch ${symbol}:`, error.message);
            results[symbol] = getDummyQuote(symbol);
        }
        
        // Add delay to avoid rate limiting
        if (i < symbols.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    res.json(results);
});

// Helper function for dummy data
function getDummyQuote(symbol) {
    const dummyPrices = {
        'SBIN': { price: 825.45, change: 5.25, changePercent: 0.64 },
        'RELIANCE': { price: 2850.50, change: 25.30, changePercent: 0.89 },
        'TCS': { price: 4125.75, change: -15.50, changePercent: -0.37 },
        'INFY': { price: 1845.60, change: -8.90, changePercent: -0.48 }
    };

    const dummy = dummyPrices[symbol] || {
        price: Math.floor(Math.random() * 2000) + 500,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 5
    };

    return {
        symbol: symbol,
        name: symbol,
        currentPrice: dummy.price,
        open: dummy.price - (dummy.change * 0.5),
        high: dummy.price + (Math.abs(dummy.change) * 0.8),
        low: dummy.price - (Math.abs(dummy.change) * 0.8),
        previousClose: dummy.price - dummy.change,
        change: dummy.change,
        changePercent: dummy.changePercent,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp: new Date().toISOString(),
        currency: 'INR',
        exchange: 'NSE',
        isRealData: false,
        isDummy: true
    };
}

app.use('/api', orderRoutes);


app.get("/" , (req,res) => {
    res.send("Server is deployed well 🚀")
})

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
