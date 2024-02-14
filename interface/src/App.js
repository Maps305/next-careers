import React, { useState, useRef } from 'react'


const skills_array = [];
function SkillsInput(currentQuestion) {
  const [skills, setSkills] = useState([]);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const newSkill = event.target.value.trim();
    if (newSkill) {
      // Update state only on Enter or blur when inputRef loses focus
      if (event.key === 'Enter' || !inputRef.current.contains(document.activeElement)) {
        setSkills([...skills, newSkill]);
        skills_array.push([...skills, newSkill])
        event.target.value = ''; // Clear input field after adding skill
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
  };

  const renderSkills = () => {
    return skills.map((skill, index) => (
      <div key={index} className="skill-chip">
        {skill}
        <button onClick={() => handleRemoveSkill(skill)}>. -x</button>
      </div>
    ));
  };

  const handleClearSkills = () => {
    setSkills([]);
  };


  return (
    <div className="">
      <input
        type="text"
        placeholder="type here..."
        ref={inputRef}
        onChange={handleInputChange}
        onKeyDown={handleInputChange}
        onBlur={handleInputChange} // Capture Enter on mobile blur
      />
      <div className="bg-slate-200 mt-3 text-sm">{renderSkills()}</div>
      <button onClick={handleClearSkills}></button>
    </div>
  );

}



const App = () => {
  // const interests = new Array();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  // toggle show recommendations
  const [showRecommendation, setShowRecommendation] = useState(false);

  const allQuestions = [
    {
      q: 0,
      text: "Are you a graduate?",
      bool_response: true,
      options: [
        {
          answer: "No"
        }, {
          answer: "Yes",
        }
      ]
    },
    {
      q: 1,
      text: "Have you taken any certifications?",
      bool_response: true,
      options: [
        {
          answer: "Yes"
        }, {
          answer: "No",
        }
      ]
    },
    {
      q: 2,
      text: "What are your interests?",
      bool_response: false,
    },
    {
      q: 3,
      text: "What are your skills?",
      bool_response: false,
    },
  ]

  const handleNext = () => {
    const handleNextQuestion = currentQuestion + 1;
    if (handleNextQuestion < allQuestions.length) {
      setCurrentQuestion(handleNextQuestion);
    } else {
      // call ML model here

      setShowRecommendation(true);
    }
  }

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <div className='bg-slate-100 p-12 rounded-lg shadow-2xl w-full max-w-xl text-center'>

        {
          showRecommendation ? (
            <>
              <div className='text-slate-700 text-md font-semibold'>
                Here are your recommendations:

                -

                -
                <hr></hr>
                Do you want to take the career quiz again?
              </div>
              <br></br>
              <button className='m-2 h-10 w-24 rounded-md bg-slate-200 hover:bg-slate-100 hover:shadow-xl transition-all duration-500'>try again</button>
            </>
          ) : (
            <>
              <div className='text-slate-700 font-semibold'>
                <div className='m-4'>
                  <span className='text-lg'>Currently at: {currentQuestion + 1}</span>/{allQuestions.length}
                </div>

                <hr></hr>

                <div className='m-4 text-md'>
                  {allQuestions[currentQuestion].text}
                </div>

                {
                  allQuestions[currentQuestion].bool_response ? (
                    <div className='w-full'>
                      {
                        allQuestions[currentQuestion].options.map((options) => (
                          <button onClick={() => handleNext(options.answer)} className='m-2 h-10 w-24 rounded-md bg-slate-200 hover:bg-slate-100 hover:shadow-xl transition-all duration-500 ease-in-out'>{options.answer}</button>
                        ))
                      }
                    </div>
                  ) : (
                    <div className='w-full'>
                      <SkillsInput />
                      <button onClick={() => handleNext()} className='m-2 h-10 w-24 rounded-md bg-slate-200 hover:bg-slate-100 hover:shadow-xl transition-all duration-500 ease-in-out'>next</button>
                      {console.log(skills_array)}
                    </div>
                  )
                }
              </div>
            </>
          )
        }
      </div>
    </div >
  )
}

export default App  