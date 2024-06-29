import nconf from 'nconf';
import path from 'path';

// Setup configuration sources: command-line arguments, environment variables, JSON file
nconf.argv({
    studentFile: {
        alias : 'sf',
        describe : 'Path of students file',
        demandOption :  false,
        type : 'string'
    },
    subjectFile : {
        alias : 'sbf',
        describe : 'Path of subjects file',
        demandOption :  false,
        type : 'string'
    },
    studentName : {
        alias : 's',
        describe : 'Student Name',
        demandOption :  false,
        type : 'string'
    }
})
.env()
.file({ file: path.join(__dirname, 'configuration.json') });

export default nconf;