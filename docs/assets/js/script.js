// JavaScript functionality for Tech Explorers website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed nav
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation delay to cards for staggered effect
    const cards = document.querySelectorAll('.session-card, .activity-card, .resource-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Simple back to top button that appears after scrolling
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.classList.add('back-to-top');
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Add this style for the back to top button
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: none;
            z-index: 99;
            transition: background-color 0.3s, transform 0.3s;
        }
        
        .back-to-top:hover {
            background-color: var(--accent-color);
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);
    
    // Simple active navigation highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Add this style for active nav items
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        nav a.active {
            color: var(--accent-color);
        }
        
        nav a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(navStyle);
    
    // Simple placeholder for a future search function
    const searchBox = document.createElement('div');
    searchBox.classList.add('search-box');
    searchBox.innerHTML = `
        <input type="text" placeholder="Search activities..." id="searchInput">
        <button id="searchButton"><i class="fas fa-search"></i></button>
    `;
    
    // Uncomment and place in desired location when ready to implement search
    // document.querySelector('.container').appendChild(searchBox);
    
    // Simple image lightbox for any images that might be added later
    document.querySelectorAll('.card img:not(.resource-card img)').forEach(image => {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            
            const img = document.createElement('img');
            img.src = this.src;
            
            lightbox.appendChild(img);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', function() {
                this.remove();
            });
        });
    });
    
    // Add this style for the lightbox
    const lightboxStyle = document.createElement('style');
    lightboxStyle.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        }
        
        .lightbox img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
    `;
    document.head.appendChild(lightboxStyle);
});

// Placeholder functions for future features
function registerForSession(sessionNum) {
    alert(`Registration for Session ${sessionNum} will be available soon!`);
}

function downloadResource(resourceName) {
    alert(`Downloading ${resourceName}...`);
    // Future implementation for downloads
}

// Simple age verification if needed for certain content
function verifyAge() {
    const birthYear = prompt("Please enter your birth year:");
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    if (age < 6) {
        alert("You may need adult supervision for these activities.");
    }
    
    return age >= 6;
}

// Easter egg for fun
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
            document.body.style.backgroundImage = "url('assets/images/stars.gif')";
            setTimeout(() => {
                document.body.style.backgroundImage = "";
            }, 3000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});