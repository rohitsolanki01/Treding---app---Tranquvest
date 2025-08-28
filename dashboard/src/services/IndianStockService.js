import axios from 'axios';

class IndianStockService {
  constructor() {
    console.log('🚀 IndianStockService initialized');
    this.backendUrl = 'http://localhost:8080'; // Your backend
  }

  async getRealTimeQuote(symbol) {
    console.log(`📊 Fetching real data for: ${symbol}`);
    
    try {

      const response = await axios.get(`${this.backendUrl}/api/nse-quote/${symbol}`, {
        timeout: 20000
      });

      if (response.data) {
        console.log(`✅ ${response.data.isRealData ? 'REAL' : 'DUMMY'} data for ${symbol}: ₹${response.data.currentPrice}`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error fetching ${symbol}:`, error.message);
      return null;
    }
  }

  async getMultipleQuotes(symbols) {
    console.log(`📈 Fetching batch data for ${symbols.length} symbols`);
    
    try {
    
      const response = await axios.post(`${this.backendUrl}/api/nse-quotes`, {
        symbols: symbols
      }, {
        timeout: 60000 // Longer timeout for batch
      });

      if (response.data) {
        const realCount = Object.values(response.data).filter(q => q.isRealData).length;
        const dummyCount = Object.values(response.data).length - realCount;
        
        console.log(`📊 Batch complete: ${realCount} real, ${dummyCount} dummy`);
        return response.data;
      }
      
      return {};
    } catch (error) {
      console.error('❌ Batch fetch error:', error.message);
      return {};
    }
  }
}

export default new IndianStockService();
