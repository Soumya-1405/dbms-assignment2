import * as fs from 'fs';
import csv from 'csv-parser';
import * as _ from 'lodash';


interface Subject {
    subjectName:string,
    totalMarks:number,
    passPercentage:number
}

interface Student{
    studentName : string,
    subjectName: string,
    Marks: number,
}

interface singleReport{
    studentName: string,
    totalmarks: number,
    percentage: number,
    result : string
}

interface combinedReport{
    singleReports : singleReport[],
    passed : Student["studentName"][],
    failCount: number,
    failed : Student["studentName"][],
    highestScorer : Student["studentName"],
    highestPercentage : number,
    lowestPercentage: number,
}


const readCSVFile  = async <T>(filepath:string): Promise<T[]> => {
    return new Promise((resolve,reject) => {
        const results:T[] = [];
        const stream = fs.createReadStream(filepath)
        stream.pipe(csv()).on('data',(data:any)=>results.push(data))
                          .on('end',()=>resolve(results))
                          .on('error',(error:string)=>reject(error))
         })
}

const calculateIndividualReport = (studentName : string,students:Student[],subjects: Subject[]):singleReport => {
    const studentGroupedData= _.groupBy(students,'StudentName');
    const student = studentGroupedData[studentName]
    const totalMarks = student.reduce((sum, mark) => sum + parseInt(mark.Marks? mark.Marks.toString(): '0'), 0);
    const totalPossibleMarks = subjects.length * 100; 
    const percentage = (totalMarks / totalPossibleMarks) * 100;

    const result = percentage>=40 && student.length>=5?"Passed":"Failed";
    const report: singleReport = {
        studentName: studentName,
        totalmarks:totalMarks ,
        percentage: percentage,
        result: result
    };
    return report
}
const calcuateCombinedReport = (students: Student[],subjects :Subject[]) : combinedReport => {
    let combinedResult: combinedReport = {
        singleReports: [],
        failCount: 0,
        highestPercentage: 0,
        lowestPercentage: Infinity,
        highestScorer: "",
        failed: [],
        passed: [],
      };
    let singleReports:singleReport[]=[];
    let failCount=0;
    let highestPercentage=0;
    let lowestPercentage : number = Infinity;
    let highest : Student["studentName"] ="";
    let failedStudents : Student["studentName"][] = []; 
    let passedStudents : Student["studentName"][] = []; 
    const studentGroupedData= _.groupBy(students,'StudentName');
    const totalSubjectMarks = subjects.length*100 
    _.forEach(studentGroupedData,(marks_subject,studentName)=>{
        var result:string="";
        const totalSubjects = marks_subject.length;
        const totalMarks = marks_subject.reduce((sum, mark) => sum + parseInt(mark.Marks? mark.Marks.toString(): '0'), 0);
        if(totalSubjects<5){
            result = "Fail, Appeared for less than 5 subjects";
            failedStudents.push(studentName);
            failCount++;
            // return
        }
        const percentage = (totalMarks/totalSubjectMarks)*100;
        if(!result){
            result = percentage>=40 && totalSubjects>=5? "Passed" : "Failed"
        }
        percentage>=40 && totalSubjects>=5 ? passedStudents.push(studentName) : null;
        if(percentage>highestPercentage){
            highestPercentage=percentage;
            highest=studentName;
        }
        lowestPercentage = percentage<lowestPercentage ? percentage : lowestPercentage;
        const output : singleReport = {
            studentName : studentName,
            totalmarks : totalMarks,
            percentage : percentage,
            result: result
        }
        singleReports.push(output)
    })
    combinedResult.singleReports = singleReports;
    combinedResult.failCount = failCount;
    combinedResult.highestPercentage = highestPercentage;
    combinedResult.lowestPercentage = lowestPercentage;
    combinedResult.highestScorer = highest;
    combinedResult.failed = failedStudents;
    combinedResult.passed = passedStudents;

    return combinedResult;
}
export {Subject,Student,singleReport,combinedReport,calcuateCombinedReport,readCSVFile,calculateIndividualReport}