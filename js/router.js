const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/curriculum": "/pages/curriculum.html",
    "/knowledge": "/pages/knowledge.html",
    "/portfolio": "/pages/portfolio.html",
    "/journal": "/pages/journal.html"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
}


window.onpopstate = handleLocation;
window.route = route;

handleLocation(); //TODO- problema se vai in un altra page e
// poi refreshi la pagina ti da errore o anche se metti l'url a mano sopra