exports.title = "C Pointer Types";

// for now we have no parameters because it isn't parameterizable
// we don't even have an outputType since we will start with only free-response
// later we need to add at least outputType and then also checking with the schema
// one param we could add is points per question? 
// no code for generating answers


exports.generateQuestion = function (randomStream){ 

   var typeNamesList = ["int","double","char","Node"];
   var numTypes = typeNamesList.length;
   randomStream.shuffle(typeNamesList);
   var typeNames = typeNamesList.slice(0);


   for (var i=0; i<typeNamesList.length; i++) {
       typeNames.push(typeNamesList[i] + " *");
   }

   var varNameList = ["a","b","c","d","e","f","g","h","p","q","r","s","t","w","x","y","z"];
   var doubleVarNameList = varNameList.concat(varNameList);

   var numVarsNeeded = typeNames.length * 2;
   var start = randomStream.nextIntRange(varNameList.length);
   var varNames = (doubleVarNameList).slice(start,start+numVarsNeeded);

   var declarations = [];

   for (var i=0; i<typeNames.length; i++) {
       var thisOne = typeNames[i] + " " + varNames[i];
       thisOne = thisOne.replace(" * "," *");
       declarations.push(thisOne);
   }

   // Now we have:
   //  varNames is the list of variables names
   //  typeNames is the list of types names
   //  declarations is the list of declarations (without semicolons);
   // The types are permuted, and the variable names are cut.
   // BUT: 0..(numTypes-1) are standard
   // BUT: numTypes..(numTypes*2-1) are pointer types
   // and the types are numTypes offset from each other.  i.e. if [i] is int, then [i+numTypes] is int *

   preContents = "<br/>nstruct Node {<br/>  int data;<br/>  Node *next;<br/>};<br/><br/>int main(int argc, char *argv[]) {<br/>";
   
   for (var i=0;i<declarations.length; i++) {
       preContents += "  " + declarations[i] + ";<br/>";
   }
   preContents += "<br/><br/>  return 0;<br/>}<br/><br/>";


   // Now for the questions:
   // For this exam: we have these types
   //  (1) Non pointer variable, undecorated
   //  (2) Pointer variable, undecorated
   //  (3) Non pointer variable with &
   //  (4) Pointer variables with &
   //  (5) Pointer variable, deferenced
   //  (6) argc  
   //  (7) argv[0]  
   //  (8) argv[1][2]  
   //  (9) Node * with arrow to next
   //  (10) Node * with arrow to data
   
   var questions=[];
   var k;

   //  (1) Non pointer variable, undecorated
   k = randomStream.nextIntRange(numTypes);
   questions.push( { q: "<code>"+varNames[k]+"</code>", a:  "<code>"+typeNames[k]+"</code>"});

   //  (2) Pointer variable, undecorated

   k = randomStream.nextIntRange(numTypes);
   questions.push( { q: "<code>"+varNames[numTypes + k]+"</code>", a:  "<code>"+typeNames[numTypes + k]+"</code>" });

   //  (3) Non pointer variable with &

   k = randomStream.nextIntRange(numTypes);
   questions.push( { q: "<code>&" + varNames[k]+"</code>", a:  "<code>"+typeNames[k] + " *</code>" });

   //  (4) Pointer variables with &

   k = randomStream.nextIntRange(numTypes);
   questions.push( { q: "<code>&" + varNames[numTypes + k]+"</code>", a:  "<code>"+typeNames[numTypes + k] + "*</code>" });

   //  (5) Pointer variable, deferenced

   k = randomStream.nextIntRange(numTypes);
   questions.push( { q: "<code>*" + varNames[numTypes + k]+"</code>", a:  "<code>"+typeNames[numTypes + k].replace(" *","")+"</code>" });

   //  (6) argc  

   questions.push( { q: "<code>argc</code>", a: "<code>int</code>"});

   //  (7) argv[0]  

   questions.push( { q: "<code>argv[0]</code>", a: "<code>char *</code>"});

   //  (8) argv[1][2]  

   questions.push( { q: "<code>argv[1][2]</code>", a: "<code>char</code>"});

   //  (9) Node * with arrow to next

   var nodeStar = typeNames.indexOf("Node *");
   questions.push( { q: "<code>"+varNames[nodeStar]+"->next</code>", a: "<code>Node *</code>" });
   
   //  (10) Node * with arrow to data

   questions.push( { q: "<code>"+varNames[nodeStar]+"->data</code>", a: "<code>int</code>" });

   // (11) Two levels of pointer

   questions.push( { q: "<code>"+varNames[nodeStar]+"->next->next</code>", a: "<code>Node *</code>" });

   randomStream.shuffle(questions);

   preContents = "Given the following declarations:<br/>" + preContents;
   preContents += "Specify the type of each of these expressions (e.g. <code>int</code>, <code>int *</code>, etc.<br/>";

  var result = {"initialLabel": preContents, 
            "questions": questions}
  return result;

}

exports.generate = function(randomStream, quizElement) {
    //PLAN: 
    //generate the full list of questions and answers
    // then return an array of quizElements
    //   first the label that is the declarations
    //   then each question that is the sub part with the associated answer
    var fullQuestionAndAnswer = exports.generateQuestion(randomStream);
    var newQuizElements = [{"label": fullQuestionAndAnswer.initialLabel}]
    for (i=0; i< fullQuestionAndAnswer.questions.length; i++) {
        var newQuestion = {
            "outputType" : "fr",
            "problemType" : "paq-C-pointer-types",
            "questionText" : fullQuestionAndAnswer.questions[i].q,
            "answer" : fullQuestionAndAnswer.questions[i].a,
        };
        if ("title" in quizElement) {
            newQuestion.title = quizElement.title;
        }

        // XXX consider changing this to points per sub part and putting in params
        //     also consider a warning if points and points per sub are provided and don't sync
        if ("points" in quizElement) {
            newQuestion.points = quizElement.points;
        }
        newQuizElements.push(newQuestion);
    }
    
	return newQuizElements;
};



