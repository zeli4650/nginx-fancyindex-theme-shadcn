(function () {
  var generatedTime = document.querySelector("[data-generated-time]");
  var currentYear = document.querySelector("[data-current-year]");
  var titleTarget = document.querySelector("[data-directory-title]");
  var generatedHeading = document.querySelector(".index-card > h1");
  var breadcrumbs = document.querySelector("[data-breadcrumbs]");
  var sortColumns = {
    N: "name",
    M: "date",
    S: "size"
  };

  function decodePathPart(part) {
    try {
      return decodeURIComponent(part);
    } catch (error) {
      return part;
    }
  }

  function prettyDirectoryName() {
    var path = window.location.pathname;
    var parts = path.split("/").filter(Boolean);
    var current = parts.length ? decodePathPart(parts[parts.length - 1]) : "Home";

    return current || "Home";
  }

  function renderBreadcrumbs() {
    if (!breadcrumbs) {
      return;
    }

    var parts = window.location.pathname.split("/").filter(Boolean);
    var accumulated = "/";
    var fragment = document.createDocumentFragment();

    function appendSeparator() {
      var separator = document.createElement("span");
      separator.className = "breadcrumbs__separator";
      separator.textContent = "\u203a";
      fragment.appendChild(separator);
    }

    var home = document.createElement(parts.length ? "a" : "span");
    home.textContent = "Home";
    if (parts.length) {
      home.href = "/";
    }
    fragment.appendChild(home);

    parts.forEach(function (part, index) {
      appendSeparator();
      accumulated += part + "/";

      var isCurrent = index === parts.length - 1;
      var crumb = document.createElement(isCurrent ? "span" : "a");
      crumb.textContent = decodePathPart(part);

      if (!isCurrent) {
        crumb.href = accumulated;
      }

      fragment.appendChild(crumb);
    });

    breadcrumbs.replaceChildren(fragment);
  }

  function markRows() {
    document.querySelectorAll(".index-card tr").forEach(function (row) {
      var link = row.querySelector("a[href]");
      var cells = row.querySelectorAll("td");

      if (!link) {
        return;
      }

      var href = link.getAttribute("href") || "";
      var label = link.textContent.trim();
      var size = cells[2] ? cells[2].textContent.trim() : "";

      if (label === "../" || href === "../") {
        row.remove();
      } else if (href.endsWith("/")) {
        row.dataset.kind = "directory";
      } else if (label.endsWith("/") || size === "-" || size === "") {
        row.dataset.kind = "directory";
      } else {
        row.dataset.kind = "file";
      }
    });
  }

  function listingTable() {
    return document.querySelector(".index-card table");
  }

  function listingBody() {
    var table = listingTable();

    if (!table) {
      return null;
    }

    return table.tBodies[0] || table;
  }

  function insertParentRow() {
    var body = listingBody();
    var currentPath = window.location.pathname;
    var row;
    var nameCell;
    var link;

    if (!body || currentPath === "/") {
      return;
    }

    row = document.createElement("tr");
    row.dataset.kind = "parent";
    row.className = "simulated-parent-row";

    nameCell = document.createElement("td");
    link = document.createElement("a");

    nameCell.colSpan = 4;
    link.href = "../";
    link.textContent = "..";
    nameCell.appendChild(link);

    row.appendChild(nameCell);

    body.insertBefore(row, body.firstElementChild);
  }

  function normalizeHeaderText(text) {
    return text.replace(/[\u2190-\u21ff\u25b2-\u25ff\u2303\u2304]/g, "").replace(/\s+/g, " ").trim();
  }

  function queryParam(url, key) {
    var query = url.search.replace(/^\?/, "").split(/[&;]/);
    var result = "";

    query.forEach(function (part) {
      var pieces = part.split("=");

      if (decodeURIComponent(pieces[0] || "") === key) {
        result = decodeURIComponent(pieces[1] || "");
      }
    });

    return result;
  }

  function sortUrl(column, order) {
    var url = new URL(window.location.href);

    url.searchParams.set("C", column);
    url.searchParams.set("O", order);

    return url.pathname + url.search + url.hash;
  }

  function setupSortHeaders() {
    var params = new URLSearchParams(window.location.search);
    var activeColumn = params.get("C") || "N";
    var activeOrder = params.get("O") || "A";

    document.querySelectorAll(".index-card th").forEach(function (header) {
      var links = Array.prototype.slice.call(header.querySelectorAll("a[href]"));
      var primaryLink = null;
      var url;
      var column;
      var nextOrder;
      var indicator;

      header.querySelectorAll(".sort-indicator").forEach(function (existingIndicator) {
        existingIndicator.remove();
      });

      links.forEach(function (link) {
        var href = link.getAttribute("href") || "";
        var linkUrl;
        var linkColumn;
        var label;

        try {
          linkUrl = new URL(href, window.location.href);
        } catch (error) {
          return;
        }

        linkColumn = queryParam(linkUrl, "C") || linkUrl.searchParams.get("C");

        if (!sortColumns[linkColumn]) {
          return;
        }

        label = normalizeHeaderText(link.textContent);

        if (!label || primaryLink) {
          link.remove();
          return;
        }

        primaryLink = link;
        url = linkUrl;
        column = linkColumn;
      });

      if (!primaryLink || !url || !sortColumns[column]) {
        return;
      }

      nextOrder = activeColumn === column && activeOrder === "A" ? "D" : "A";
      primaryLink.textContent = normalizeHeaderText(primaryLink.textContent);
      primaryLink.href = sortUrl(column, nextOrder);
      primaryLink.dataset.sortColumn = sortColumns[column];
      primaryLink.dataset.sortActive = activeColumn === column ? "true" : "false";
      primaryLink.dataset.sortOrder = activeColumn === column ? activeOrder : "";

      indicator = document.createElement("span");
      indicator.className = "sort-indicator";
      indicator.setAttribute("aria-hidden", "true");
      primaryLink.appendChild(indicator);

      primaryLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = sortUrl(column, nextOrder);
      });
    });
  }

  function formatListingDates() {
    var months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };

    document.querySelectorAll(".index-card tr").forEach(function (row) {
      var cells = row.querySelectorAll("td");
      var dateCell = cells[1];

      if (!dateCell) {
        return;
      }

      var value = dateCell.textContent.trim().replace(/\s+/g, " ");
      var match = value.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2})$/);

      if (!match || !months[match[2]]) {
        return;
      }

      dateCell.textContent = match[3] + "-" + months[match[2]] + "-" + match[1].padStart(2, "0") + " " + match[4] + ":" + match[5];
    });
  }

  function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  }

  renderBreadcrumbs();
  markRows();
  insertParentRow();
  formatListingDates();
  setupSortHeaders();

  if (titleTarget) {
    titleTarget.textContent = prettyDirectoryName();
    document.title = "Index of " + window.location.pathname;
  }

  if (generatedHeading && generatedHeading.textContent.trim()) {
    generatedHeading.setAttribute("aria-hidden", "true");
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (generatedTime) {
    generatedTime.textContent = formatDate(new Date());
  }
}());
