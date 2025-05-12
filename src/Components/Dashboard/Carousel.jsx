import { useState, useEffect } from 'react';

const carouselItems = [
    {
        title: 'Get a link that you can share',
        description: 'Click New meeting to get a link you can send to people you want to meet with.',
        image: 'https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg',
    },
    {
        title: 'Plan ahead',
        description: 'Schedule a meeting and share the invite with participants in advance.',
        image: 'https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg',
    },
    {
        title: 'Start an instant meeting',
        description: 'Create a meeting and start right away with a single click.',
        image: 'https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg',
    },
];

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((currentIndex + 1) % carouselItems.length);
    const prev = () => setCurrentIndex((currentIndex - 1 + carouselItems.length) % carouselItems.length);

    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 5000); 

        return () => clearInterval(interval);
    }, [currentIndex]);

    const { title, description, image } = carouselItems[currentIndex];

    return (
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner ">
                <div className="carousel-item active d-flex justify-content-center">
                    <img src={image} className="d-block w-75" alt="..." />
                    <div className="carousel-caption d-none d-md-block text-dark">
                        <h5>{title}</h5>
                        <p>{description}</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={image} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-none d-md-block text-dark">
                        <h5>{title}</h5>
                        <p>{description}</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={image} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-none d-md-block text-dark">
                        <h5>{title}</h5>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Carousel;
