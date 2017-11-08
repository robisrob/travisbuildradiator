function fillBuildInfo() {
    getFailingBuildsPromise().then(failedBuilds => {
        setBackgroundColorBody();
        removeAllBuildsOnScreen();
        addAllFailingBuilds();

        function setBackgroundColorBody() {
            let backgroundColor = failedBuilds.length > 0 ? "DarkRed" : "green";
            document.getElementById("buildinfo").style.backgroundColor = backgroundColor;
        }

        function removeAllBuildsOnScreen() {
            [].slice.call(document.getElementsByClassName("build"))
                .forEach(removeElement => document.body.removeChild(removeElement));
        }

        function addAllFailingBuilds() {
            failedBuilds.forEach(failedBuild => {
                var divFailedBuild = document.createElement("div");
                divFailedBuild.id = failedBuild;
                divFailedBuild.className = "build";
                divFailedBuild.innerHTML = failedBuild;
                document.body.appendChild(divFailedBuild)
            })
        }

    });

    function getFailingBuildsPromise() {

        return wrapAllFailedBuildsInOnePromise();

        function wrapAllFailedBuildsInOnePromise() {
            return Promise.all(getBuildPromises()).then(builds => builds.filter(build => build.status !== 0 && build.status != null).map(build => build.alias));

        }

        function getBuildPromises() {
            let init = {
                method: 'GET',
                headers: new Headers({
                    'Accept': 'application/json',
                    'User-Agent': 'travisbuildradiator'
                })
            };

            return buildUrls.map(
                buildToCheck =>
                    fetch(getUrl(buildToCheck.repoName), init)
                        .then(response => response.json()
                            .then(json => ({ alias: buildToCheck.alias, status: json.last_build_result })
                            )));

            function getUrl(repoName) {
                return "https://api.travis-ci.org/" + repoName +".json";
            }
        }
    }
}

