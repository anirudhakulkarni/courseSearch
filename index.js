// read file
var students = new XMLHttpRequest();
students.open('GET', 'students.json', false);
students.send(null);
var students = JSON.parse(students.responseText);
function showmore(name) {
	// set the xx div visible
	var xx = document.getElementById('xx' + name);
	if (xx.style.display === 'none') {
		xx.style.display = 'block';
	} else {
		xx.style.display = 'none';
	}
}

function getTable(st) {
	var html = '';
	html += '<table class="table table-striped table-bordered">';
	// columns are semester names {semester1, semester2, ...}
	// sample course 2102-ASL340. extract semester as 2102
	var columns = '';
	for (var i = 0; i < st.courses.length; i++) {
		var course = st.courses[i];
		var semester = course.substring(0, 4);
		if (columns.indexOf(semester) == -1) {
			columns += semester + ',';
		}
	}
	columns = columns.split(',');
	columns.pop();
	for (var i = 0; i < columns.length; i++) {
		html += '<th>' + columns[i] + '</th>';
	}
	html += '</tr>';
	// rows are courses
	var courses = [[]];
	for (var i = 0; i < st.courses.length; i++) {
		var course = st.courses[i];
		var semester = course.substring(0, 4);
		var course = course.substring(5);
		var index = columns.indexOf(semester);
		if (courses[index] == undefined) {
			courses[index] = [];
		}
		courses[index].push(course);
	}
	// transpose the courses
	var max = 0;
	for (var i = 0; i < courses.length; i++) {
		if (courses[i].length > max) {
			max = courses[i].length;
		}
	}
	for (var i = 0; i < max; i++) {
		html += '<tr>';
		for (var j = 0; j < courses.length; j++) {
			if (courses[j][i] == undefined) {
				html += '<td></td>';
			} else {
				// course + page link
				html += '<td><a href="http://ldapweb.iitd.ac.in/LDAP/courses/'+columns[j]+'-' + courses[j][i] + '.shtml">' + courses[j][i] + '</a></td>';
				// html += '<td>' + courses[j][i]+
				//  + '</td>';
			}
		}
		html += '</tr>';
	}

	// add courses to respective columns
	// semester is a column

	// for(var i=0;i<st.courses.length;i++) {
	//     var course = st.courses[i];
	//     var semester = course.substring(0,4);
	//     var course = course.substring(5);
	//     html += '<tr>';
	//     for(var j=0;j<columns.length;j++) {
	//         if(columns[j] == semester) {
	//             html += '<td>' + course + '</td>';
	//         } else {
	//             html += '<td></td>';
	//         }
	//     }
	//     html += '</tr>';
	// }
	html += '</table>';
	// html += '<tr><th>Sr</th><th>Course</th></tr>';
	// for (var i = 0; i < st.courses.length; i++) {
	// 	html +=
	// 		'<tr><td>' + (i + 1) + '</td><td>' + st.courses[i] + '</td></tr>';
	// }
	// html += '</table>';
	return html;
}
function getdata(st) {
	// return html with formatted data of each student
	var html = '';
	html += '<tr>';
	// fancy name font
	html += '<td><b>' + st.name + '</b></td>';
	// kerberos
	html += '<td><b>' + st.kerberos + '</b></td>';
	// html += '<td>' + st.name + '</td>';
	// html += '<td>' + st.kerberos + '</td>';
	html += '<td>';
	// display courses in table
	html += getTable(st);
	html += '</td>';
	html += '</tr>';

	// html += '</div>';
	// html += '</div>';
	return html;
}
function kerberosToEntry(kerberos) {
	var entry = '';
	// kerberos = cs5190421 to entry = 2019CS50421
	// year = 19
	// dept = CS5
	// roll = 0421
	var year = kerberos.substring(3, 5);
	var dept = kerberos.substring(0, 3);
	var roll = kerberos.substring(5);
	entry = '20' + year + dept + roll;
	// entry = '20' + year + dept + roll;
	return entry;
}
// ismatch
function ismatch(st, search) {
	if (st.name.toLowerCase().indexOf(search) != -1) {
		return true;
	}
	if (st.kerberos.toLowerCase().indexOf(search) != -1) {
		return true;
	}
	for (var i = 0; i < st.courses.length; i++) {
		if (st.courses[i].toLowerCase().indexOf(search) != -1) {
			return true;
		}
	}
	if (kerberosToEntry(st.kerberos.toLowerCase()).indexOf(search) != -1) {
		return true;
	}
	if (st.kerberos.toLowerCase().indexOf(search) != -1) {
		return true;
	}
	return false;
}
// search function
function searchStudents() {
	var search = document.getElementById('search').value;
	var result = document.getElementById('result');
	var html =
		'<table class="table table-striped"><thead><tr><th>Name</th><th>Kerberos</th><th>Courses</th></tr></thead><tbody>';

	var res = [];
	for (var i = 0; i < students.length; i++) {
		// var result = students[i].name.toLowerCase().indexOf(search.toLowerCase());
		// var result = ismatch(students[i],search.toLowerCase());
		// console.log(result);
		// search case insensitive
		if (
			// result==true
			ismatch(students[i], search.toLowerCase())
		) {
			// show name, kerberos, courses registered
			// console.log(students[i]);
			res.push(students[i]);
			// html += getdata(students[i]);
			// html += "<div>" + students[i].name + " " + students[i].kerberos + " " + students[i].courses + "</div>";
		}
	}
	res.sort(function (a, b) {
		return a.name.localeCompare(b.name);
	});
	var maxResults = document.getElementById('maxResults').value;
	for (var i = 0; i < res.length && i < maxResults; i++) {
		// for (var i = 0; i < max(res.length, maxResults); i++) {
		html += getdata(res[i]);
	}
	html += '</tbody></table>';
	result.innerHTML = html;
	document.getElementById('resultsFoundNumber').innerHTML = res.length;
	statshtml = '';
	// iterate on each students courses list and add to semester wise stats
	columns = [];
	for (var i = 0; i < res.length; i++) {
		var st = res[i];
		for (var j = 0; j < st.courses.length; j++) {
			var course = st.courses[j];
			var semester = course.substring(0, 4);
			var course = course.substring(5);
			if (columns.indexOf(semester) == -1) {
				columns.push(semester);
			}
		}
	}
	// sort columns
	columns.sort();
	// console.log(columns);
	// sample stats
	// list                 sem1    sem2    sem3    sem4
	// averageCourseCount   3.5     3.5     3.5     3.5
	// maxCourseCount       4       4       4       4
	// minCourseCount       3       3       3       3

	// add stats
	statshtml += '<table class="table table-striped"><thead><tr><th>Stats</th>';
	for (var i = 0; i < columns.length; i++) {
		statshtml += '<th>' + columns[i] + '</th>';
	}
	statshtml += '</tr></thead><tbody>';
	// averageCourseCount
	statshtml += '<tr><td>Average Course Count</td>';
	for (var i = 0; i < columns.length; i++) {
		var sum = 0;
		var count = 0;
		for (var j = 0; j < res.length; j++) {
			var st = res[j];
			for (var k = 0; k < st.courses.length; k++) {
				var course = st.courses[k];
				var semester = course.substring(0, 4);
				var course = course.substring(5);
				if (semester == columns[i]) {
					sum += 1;
				}
			}
		}
		if (sum == 0) {
			statshtml += '<td>0</td>';
		} else {
			statshtml += '<td>' + (sum / res.length).toFixed(2) + '</td>';
		}
	}
	statshtml += '</tr>';
	// maxCourseCount
	statshtml += '<tr><td>Max Course Count</td>';
	for (var i = 0; i < columns.length; i++) {
		var max = 0;

		for (var j = 0; j < res.length; j++) {
			var st = res[j];
			var count = 0;
			for (var k = 0; k < st.courses.length; k++) {
				var course = st.courses[k];
				var semester = course.substring(0, 4);
				var course = course.substring(5);
				if (semester == columns[i]) {
					count += 1;
				}
			}
			if (count > max) {
				max = count;
			}
		}
		statshtml += '<td>' + max + '</td>';
	}
	statshtml += '</tr>';
	// // minCourseCount
	// statshtml += '<tr><td>Min Course Count</td>';
	// for(var i=0;i<columns.length;i++) {
	//     var min = 0;

	//     for(var j=0;j<res.length;j++) {
	//         var st = res[j];
	//         var count = 0;
	//         for(var k=0;k<st.courses.length;k++) {
	//             var course = st.courses[k];
	//             var semester = course.substring(0,4);
	//             var course = course.substring(5);
	//             if(semester == columns[i]) {
	//                 count += 1;
	//             }
	//         }
	//         if(count < min) {
	//             min = count;
	//         }
	//     }
	//     statshtml += '<td>' + min + '</td>';
	// }
	// statshtml += '</tr>';
	statshtml += '</tbody></table>';

	document.getElementById('resultsStats').innerHTML = statshtml;
}
// show result when typing

document.getElementById('search').addEventListener('keyup', searchStudents);
// show result when range is changed
document
	.getElementById('maxResults')
	.addEventListener('change', searchStudents);

window.onload = searchStudents;
