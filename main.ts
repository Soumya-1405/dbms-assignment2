import config from './config'
import {Subject,Student,singleReport,combinedReport,calcuateCombinedReport,readCSVFile,calculateIndividualReport} from './data'
import nconf from './config';



const main = async () => {
    const subjectFile = nconf.get('subjectFile');
    const studentFile = config.get('studentFile');
    const studentName = config.get('studentName');
    console.log(subjectFile)

    if(!subjectFile || !studentFile){
        return "Give Proper input";
    }
    try {
        const students: Student[] = await readCSVFile<Student>(studentFile);
        const subjects: Subject[] = await readCSVFile<Subject>(subjectFile);
        var report: singleReport | combinedReport 
        if(studentName){
            report = calculateIndividualReport(studentName,students,subjects)
        }
        else{
            report = calcuateCombinedReport(students, subjects);
        }
        console.log(report);
    } catch (error) {
        console.error('Error:', error);
    }

}

main();









