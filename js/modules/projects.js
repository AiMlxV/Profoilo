function refreshAOS() {
    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
    } else if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
    }
}

export function displayProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<span class="loading loading-spinner loading-md"></span>';

    setTimeout(() => {
        projectsGrid.innerHTML = '';
        projects.forEach((project, idx) => {
            const projectCard = `
                <a href="${project.link}" class="block group bg-base-100 rounded-2xl overflow-hidden shadow-lg border-2 border-base-300 transform transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-primary cursor-pointer animate-card-in" style="animation-delay: ${Math.min(idx * 80, 480)}ms" data-aos="fade-up">
                    <div class="relative overflow-hidden">
                        <img src="${project.image}" alt="${project.title}" class="w-full h-52 object-cover transform transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div class="badge badge-primary badge-lg">View Project</div>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-2xl font-bold mb-3 text-base-content group-hover:text-primary transition-colors">${project.title}</h3>
                        <p class="text-base-content/70 mb-4 line-clamp-3">${project.description}</p>
                        <div class="flex items-center text-primary font-semibold transition-all group-hover:gap-3">
                            <span>View more</span>
                            <i class="fas fa-arrow-right ml-2 transform transition-transform group-hover:translate-x-2"></i>
                        </div>
                    </div>
                </a>
            `;
            projectsGrid.innerHTML += projectCard;
        });

        refreshAOS();
    }, 500);
}
