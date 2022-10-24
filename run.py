baseurl="http://ldapweb.iitd.ac.in/LDAP/courses/"
import requests
from bs4 import BeautifulSoup
import json
def get_course_list():
    r = requests.get(baseurl+"gpaliases.html")
    soup = BeautifulSoup(r.content, "html.parser")
    table = soup.find('table',attrs={'border':'1'})
    # print(table)
    rows = table.find_all('tr')
    dict={}
    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        if len(cols) == 1:
            dict[cols[0]] = baseurl+cols[0]+".shtml"
    return dict

def get_course_details(course):
    r = requests.get(course)
    soup = BeautifulSoup(r.content, "html.parser")
    table = soup.find('table',attrs={'border':'1'})
    # print(table)
    rows = table.find_all('tr')
    dict={}
    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        if len(cols) == 2:
            dict[cols[0]] = cols[1]
    return dict

def get_students():
    courses=get_course_list()
    # dump the courses to a json file
    with open('courses.json', 'w') as fp:
        json.dump(courses, fp)
    students={}
    for course in courses:
        studentsincourse=get_course_details(courses[course])
        for student in studentsincourse:
            if student not in students:
                students[student]={"name": "","courses":[]}
            students[student]["name"]=studentsincourse[student]
            students[student]["courses"].append(course)
    json_object = []
    for student in students:
        json_object.append({"name": students[student]["name"],"kerberos": student,"courses": students[student]["courses"]})
    # dump the students to a json file
    with open('students.json', 'w') as fp:
        json.dump(json_object, fp)
    return students

if __name__ == "__main__":
    students=get_students()
    