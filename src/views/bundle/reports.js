module.exports = "<div ng-repeat=\"report in reports\">\n\t<div>\n\t\t<h2>{{report.name}}</h2>\n\t\t<div class=\"gallery\">\n\t\t\t<img ng-repeat=\"image in report.image\" src=\"{{image}}\" style=\"display:inline-block;\" onclick=\"window.open(this.src, '_blank');\"><br>\n\t\t</div>\n\t\tCategory: {{report.category}}<br>\n\t\tFound: {{report.locationFound}} - {{report.dateFound}}<br>\n\t\tListed: {{report.dateListed}}<br>\n\t\t<br>\n\t\t{{report.description}}<br>\n\t</div>\n\t<div style=\"float: left;\">\n\t\tStatus: {{report.status}}<br>\n\t\t<div ng-show=\"report.status === 'request approved'\">\n\t\t\tPlease contact {{report.contact.username}} at {{report.contact.email}}\n\t\t</div>\n\t</div>\n\t<br>\n</div>"