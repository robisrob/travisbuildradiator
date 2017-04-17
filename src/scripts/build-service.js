function fillBuildInfo() {
    getFailingBuildsPromise().then(failedBuilds => {
        let backgroundColor = failedBuilds.length > 0 ? "red" : "green";
        document.getElementById("buildinfo").style.backgroundColor = backgroundColor;
    });
}

function getFailingBuildsPromise() {
    let buildUrls = [
        { name: "build A", url: "https://api.travis-ci.org/robisrob/buildradiator.json" },
        { name: "build B", url: "https://api.travis-ci.org/robisrob/gameoflivecsharp.json" },
        { name: "build C", url: "https://api.travis-ci.org/SoftwareSandbox/FiAngulartje.json" },
    ];

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