var buildUrls = [
    { name: "build A", url: "https://api.travis-ci.org/robisrob/buildradiator.json" },
    { name: "build B", url: "https://api.travis-ci.org/robisrob/gameoflivecsharp.json" },
    { name: "build C", url: "https://api.travis-ci.org/SoftwareSandbox/FiAngulartje.json" },
];

function fillBuildInfo() {
    getFailingBuildsPromise().then(failedBuilds => {
        setBackgroundColorBody();
        removeAllBuildsOnScreen();
        addAllFailingBuilds();

        function addAllFailingBuilds() {
            failedBuilds.forEach(failedBuild => {
                var divFailedBuild = document.createElement("div");
                divFailedBuild.id = failedBuild;
                divFailedBuild.className = "build";
                divFailedBuild.innerHTML = failedBuild;
                document.body.appendChild(divFailedBuild)
            })
        }

        function removeAllBuildsOnScreen() {
            [].slice.call(document.getElementsByClassName("build"))
                .forEach(removeElement => document.body.removeChild(removeElement));
        }

        function setBackgroundColorBody() {
            let backgroundColor = failedBuilds.length > 0 ? "red" : "green";
            document.getElementById("buildinfo").style.backgroundColor = backgroundColor;
        }

    });
}

function getFailingBuildsPromise() {
    let init = {
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/json',
            'User-Agent': 'travisbuildradiator'
        })
    };

    let buildPromises = buildUrls.map(
        buildToCheck =>
            fetch(buildToCheck.url, init)
                .then(response => response.json()
                    .then(json => ({ name: buildToCheck.name, status: json.last_build_status })
                    )));

    return Promise.all(buildPromises).then(builds => builds.filter(build => build.status !== 0).map(build => build.name));
}