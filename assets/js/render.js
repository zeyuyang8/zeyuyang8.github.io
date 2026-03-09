function formatAuthors(authors) {
  return authors.map(function (name) {
    if (name.startsWith("*") && name.endsWith("*")) {
      return "<b>" + name.slice(1, -1) + "</b>";
    }
    return '<span class="text-coauthor">' + name + "</span>";
  }).join(", ");
}

function formatLinks(links) {
  return links.map(function (link) {
    return '<a href="' + link.url + '" target="_blank"> <small>[' + link.label + "]</small></a>";
  }).join("\n");
}

var pubActiveTopic = "All";
var pubFromYear = 2025;
var pubToYear = 2026;

function filterAndSort(data) {
  var filtered = data;
  if (pubActiveTopic !== "All") {
    filtered = filtered.filter(function (d) { return d.topic === pubActiveTopic; });
  }
  filtered = filtered.filter(function (d) { return d.year >= pubFromYear && d.year <= pubToYear; });
  return filtered.slice().sort(function (a, b) { return b.year - a.year; });
}

function renderPublicationRows(data, container) {
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    html += '<div class="row" style="padding: 15px 0;">';
    html += '<div class="col-md-12">';
    html += '<a class="paper-title" href="' + item.url + '" target="_blank">' + item.title + "</a><br>";
    html += formatAuthors(item.authors) + "<br>";
    html += item.venue + " <br>";
    html += formatLinks(item.links);
    html += "</div></div>";
  }
  if (html === "") {
    html = '<div class="text-muted-custom" style="padding: 15px 0;">No publications found.</div>';
  }
  container.innerHTML = html;
}

function setActiveButton(activeBtn, allBtns) {
  for (var i = 0; i < allBtns.length; i++) {
    allBtns[i].className = "pub-pill";
  }
  activeBtn.className = "pub-pill active";
}

function createDropdown(options, selected, onChange) {
  var wrap = document.createElement("div");
  wrap.className = "pub-dropdown";

  var trigger = document.createElement("button");
  trigger.className = "pub-dropdown-trigger";
  trigger.textContent = selected;
  wrap.appendChild(trigger);

  var menu = document.createElement("div");
  menu.className = "pub-dropdown-menu";
  for (var m = 0; m < options.length; m++) {
    var item = document.createElement("div");
    item.className = "pub-dropdown-item" + (options[m] === selected ? " active" : "");
    item.textContent = options[m];
    item.setAttribute("data-value", options[m]);
    menu.appendChild(item);
  }
  wrap.appendChild(menu);

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    var allMenus = document.querySelectorAll(".pub-dropdown-menu.open");
    for (var k = 0; k < allMenus.length; k++) {
      if (allMenus[k] !== menu) allMenus[k].classList.remove("open");
    }
    menu.classList.toggle("open");
  });

  menu.addEventListener("click", function (e) {
    var target = e.target;
    if (!target.classList.contains("pub-dropdown-item")) return;
    var val = parseInt(target.getAttribute("data-value"));
    trigger.textContent = val;
    var items = menu.querySelectorAll(".pub-dropdown-item");
    for (var n = 0; n < items.length; n++) { items[n].classList.remove("active"); }
    target.classList.add("active");
    menu.classList.remove("open");
    onChange(val);
  });

  return wrap;
}

function renderPublications(data, containerId) {
  var wrapper = document.getElementById(containerId);
  var topics = publicationTopics;

  // Control bar
  var controlBar = document.createElement("div");
  controlBar.className = "pub-controls";

  // Topic filters (left)
  var topicBar = document.createElement("div");
  topicBar.className = "pub-control-group";
  var topicLabel = document.createElement("span");
  topicLabel.className = "pub-control-label";
  topicLabel.textContent = "Topic";
  topicBar.appendChild(topicLabel);

  var allTopicBtns = [];
  var allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = "pub-pill active";
  topicBar.appendChild(allBtn);
  allTopicBtns.push(allBtn);

  for (var t = 0; t < topics.length; t++) {
    var btn = document.createElement("button");
    btn.textContent = topics[t];
    btn.className = "pub-pill";
    topicBar.appendChild(btn);
    allTopicBtns.push(btn);
  }

  // Right side: year range
  var rightBar = document.createElement("div");
  rightBar.className = "pub-control-group";

  var yearLabel = document.createElement("span");
  yearLabel.className = "pub-control-label";
  yearLabel.textContent = "Year";
  rightBar.appendChild(yearLabel);

  // Build year options from data
  var yearSet = {};
  for (var d = 0; d < data.length; d++) { yearSet[data[d].year] = true; }
  var yearOptions = Object.keys(yearSet).map(Number).sort(function (a, b) { return a - b; });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function () {
    var allMenus = document.querySelectorAll(".pub-dropdown-menu.open");
    for (var k = 0; k < allMenus.length; k++) { allMenus[k].classList.remove("open"); }
  });

  var listDiv = document.createElement("div");
  listDiv.id = "publications-rows";

  var fromDropdown = createDropdown(yearOptions, pubFromYear, function (val) {
    pubFromYear = val;
    renderPublicationRows(filterAndSort(data), listDiv);
  });
  rightBar.appendChild(fromDropdown);

  var dash = document.createElement("span");
  dash.className = "pub-year-dash";
  dash.textContent = "\u2192";
  rightBar.appendChild(dash);

  var toDropdown = createDropdown(yearOptions, pubToYear, function (val) {
    pubToYear = val;
    renderPublicationRows(filterAndSort(data), listDiv);
  });
  rightBar.appendChild(toDropdown);

  controlBar.appendChild(topicBar);
  controlBar.appendChild(rightBar);
  wrapper.appendChild(controlBar);
  wrapper.appendChild(listDiv);

  // Initial render
  renderPublicationRows(filterAndSort(data), listDiv);

  // Topic filter events
  for (var i = 0; i < allTopicBtns.length; i++) {
    (function (btn, index) {
      btn.addEventListener("click", function () {
        pubActiveTopic = index === 0 ? "All" : topics[index - 1];
        setActiveButton(btn, allTopicBtns);
        renderPublicationRows(filterAndSort(data), listDiv);
      });
    })(allTopicBtns[i], i);
  }
}

function renderSoftware(data, containerId) {
  var container = document.getElementById(containerId);
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    html += '<div class="row" style="padding: 15px 0;">';
    html += '<div class="col-md-12">';
    html += '<a class="paper-title" href="' + item.url + '" target="_blank">' + item.title + "</a><br>";
    html += formatAuthors(item.authors) + "<br>";
    html += formatLinks(item.links);
    html += "</div></div>";
  }
  container.innerHTML = html;
}

function renderExperience(data, containerId) {
  var container = document.getElementById(containerId);
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    html += '<div class="card" style="margin-bottom: 15px;">';
    html += '<div class="card-body">';
    html += '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline;">';
    html += '<h5 class="card-title" style="margin-bottom: 5px;">' + item.company + "</h5>";
    html += '<span class="text-muted-custom">' + item.period + "</span>";
    html += "</div>";
    html += '<p class="card-text" style="margin-bottom: 0;">' + item.role + "</p>";
    html += "</div></div>";
  }
  container.innerHTML = html;
}

function renderTeaching(data, containerId) {
  var container = document.getElementById(containerId);
  var html = '<table class="table table-borderless" style="margin-bottom: 0;">';
  html += "<thead><tr>";
  html += '<th style="width: 80%;">Course</th>';
  html += '<th style="width: 20%; text-align: right;">Role</th>';
  html += "</tr></thead><tbody>";
  for (var i = 0; i < data.length; i++) {
    html += "<tr>";
    html += "<td>" + data[i].course + "</td>";
    html += '<td style="text-align: right;">' + data[i].role + "</td>";
    html += "</tr>";
  }
  html += "</tbody></table>";
  container.innerHTML = html;
}

function renderHonors(data, containerId) {
  var container = document.getElementById(containerId);
  var html = '<table class="table table-borderless" style="margin-bottom: 0; table-layout: fixed;">';
  html += "<thead><tr>";
  html += '<th style="width: 80%;">Honor</th>';
  html += '<th style="width: 20%; text-align: right;">Year</th>';
  html += "</tr></thead><tbody>";
  for (var i = 0; i < data.length; i++) {
    html += "<tr>";
    html += "<td>" + data[i].honor + "</td>";
    html += '<td style="text-align: right; font-variant-numeric: tabular-nums;">' + data[i].year + "</td>";
    html += "</tr>";
  }
  html += "</tbody></table>";
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  renderPublications(publications, "publications-list");
  renderSoftware(software, "software-list");
  renderExperience(experience, "experience-list");
  renderTeaching(teaching, "teaching-list");
  renderHonors(honors, "honors-list");
});
