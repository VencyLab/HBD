document.addEventListener('DOMContentLoaded', function() {
    function scrollToElement(targetId, offset = 100) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const elementRect = targetElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementCenter = elementRect.top + window.pageYOffset + (elementRect.height / 2);
            const offsetPosition = elementCenter - (viewportHeight / 2) - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToElement(targetId, 0);
        });
    });

    const photoContainer = document.querySelector('.photo-container');
    let photos = Array.from(photoContainer.children);
    let isDown = false;
    let startX;
    let scrollLeft;

    function clonePhotos() {
        const cloneCount = 1; // Number of clones on each side
        photos.forEach(photo => {
            const clone = photo.cloneNode(true);
            photoContainer.appendChild(clone);
            photoContainer.insertBefore(clone.cloneNode(true), photoContainer.firstChild);
        });
        photos = Array.from(photoContainer.children);
        photoContainer.scrollLeft = photoContainer.scrollWidth / 3; // Center the view on initial load
    }
    clonePhotos();

    function handleScroll() {
        const containerWidth = photoContainer.clientWidth;
        const scrollWidth = photoContainer.scrollWidth;
        const maxScrollLeft = scrollWidth - containerWidth;

        if (photoContainer.scrollLeft <= 0) {
            photoContainer.scrollLeft = scrollWidth / 3;
        }
        if (photoContainer.scrollLeft >= maxScrollLeft) {
            photoContainer.scrollLeft = scrollWidth / 3;
        }
    }

    photoContainer.addEventListener('scroll', handleScroll);

    function startSwipe(e) {
        isDown = true;
        photoContainer.classList.add('active');
        startX = e.pageX || e.touches[0].pageX; // Handle touch or mouse
        scrollLeft = photoContainer.scrollLeft;
        e.preventDefault();
    }

    function endSwipe() {
        isDown = false;
        photoContainer.classList.remove('active');
        snapToClosestPhoto();
    }

    function moveSwipe(e) {
        if (!isDown) return;
        const x = e.pageX || e.touches[0].pageX; // Handle touch or mouse
        const walk = (x - startX) * 2; // Adjust scroll speed for a magnetic effect
        photoContainer.scrollLeft = scrollLeft - walk;
    }

    photoContainer.addEventListener('mousedown', startSwipe);
    photoContainer.addEventListener('mouseleave', endSwipe);
    photoContainer.addEventListener('mouseup', endSwipe);
    photoContainer.addEventListener('mousemove', moveSwipe);

    photoContainer.addEventListener('touchstart', startSwipe);
    photoContainer.addEventListener('touchend', endSwipe);
    photoContainer.addEventListener('touchmove', moveSwipe);

    function highlightCenterPhoto() {
        const containerCenter = photoContainer.clientWidth / 2;
        let closestPhoto = null;
        let closestDistance = Infinity;

        photos.forEach(photo => {
            const photoRect = photo.getBoundingClientRect();
            const photoCenter = photoRect.left + (photoRect.width / 2);
            const distance = Math.abs(containerCenter - photoCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestPhoto = photo;
            }

            // Reset all photos to default
            photo.classList.remove('centered');
        });

        if (closestPhoto) {
            closestPhoto.classList.add('centered');
        }
    }

    function snapToClosestPhoto() {
        const containerCenter = photoContainer.clientWidth / 2;
        let closestPhoto = null;
        let closestDistance = Infinity;
        let closestPhotoLeft = 0;

        photos.forEach(photo => {
            const photoRect = photo.getBoundingClientRect();
            const photoCenter = photoRect.left + (photoRect.width / 2);
            const distance = Math.abs(containerCenter - photoCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestPhoto = photo;
                closestPhotoLeft = photoRect.left;
            }
        });

        if (closestPhoto) {
            const scrollOptions = {
                left: photoContainer.scrollLeft + closestPhotoLeft - containerCenter + closestPhoto.clientWidth / 2,
                behavior: 'smooth'
            };
            photoContainer.scrollTo(scrollOptions);
        }
    }

    photoContainer.addEventListener('scroll', highlightCenterPhoto);
    window.addEventListener('resize', highlightCenterPhoto);

    highlightCenterPhoto();
    handleScroll();
});
