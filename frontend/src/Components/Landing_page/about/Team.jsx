import React from 'react'

const Team = () => {
  return (
    <>
        <div className="container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 text-center">
                    <h1 className="fw-bold">Meet Our Team</h1>
                    <p className="text-muted">The brilliant minds behind Tranquvest</p>
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <div className="founder_image shadow"></div>
                    <div className="founder_content text-center mt-4">
                        <h3 className="mb-1">Rohit Solanki</h3>
                        <p className="text-muted mb-3">Founder & CEO</p>
                        <div className="social-links">
                            <a href="https://github.com/rohitsolanki01" className="text-muted me-3" aria-label="Github"><i className="fa-brands fa-github fa-lg"></i></a>
                            <a href="https://x.com/Rohit_01_tech" className="text-muted me-3" aria-label="Twitter"><i className="fa-brands fa-x-twitter fa-lg"></i></a>
                            <a href="https://www.instagram.com/rohit__solanki__32/" className="text-muted me-3" aria-label="Instagram"><i className="fa-brands fa-instagram fa-lg"></i></a>
                            <a href="https://www.linkedin.com/in/rohit-solanki-495860348/" className="text-muted" aria-label="LinkedIn"><i className="fa-brands fa-linkedin fa-lg"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="bg-light p-4 rounded-3">
                        <p className="lead mb-4">While I'm at the beginning of my entrepreneurial journey, I'm passionate about creating a platform that revolutionizes how people invest and trade in the market.</p>
                        <p className="mb-3">With a vision to democratize investing, he founded Tranquvest to create a platform that makes trading accessible and efficient for everyone.</p>
                        <p>Under his leadership, Tranquvest has grown to become one of the most trusted names in online trading platforms.</p>
                    </div>
                </div>
            </div>
        </div>  
    </>
  )
}

export default Team