document.addEventListener("DOMContentLoaded", function () {
    const lastUpdatedElement = document.getElementById("last-updated");
    const lastUpdatedDate = new Date(document.lastModified).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    lastUpdatedElement.textContent = lastUpdatedDate;
});
