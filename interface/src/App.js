import React, { useState, useRef } from 'react'
import axios from 'axios'


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
        //
        if (!skills_array.includes(newSkill)) {
          skills_array.push([...skills, newSkill]);
        }
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
        <button className='bg-red-300 rounded-md m-1 py-1 px-2' onClick={() => handleRemoveSkill(skill)}>-</button>
      </div>
    ));
  };

  const handleClearSkills = () => {
    setSkills([]);
  };


  return (
    <div className="m-2">
      <input
        type="text"
        placeholder="type here..."
        ref={inputRef}
        onChange={handleInputChange}
        onKeyDown={handleInputChange}
        onBlur={handleInputChange} // Capture Enter on mobile blur
        className="p-2 text-sm"
      />
      <div className="bg-slate-200 mt-3 text-sm text-left">{renderSkills()}</div>
      <button onClick={handleClearSkills}></button>
    </div>
  );

}
const App = () => {
  // const interests = new Array();
  const [recommendations, setRecommendations] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // toggle show recommendations
  const [showRecommendation, setShowRecommendation] = useState(false);
  const handleRecommendations = async () => {
    // ... button logic
    if (skills_array.length > 0) {
      // const skillsString = skills_array.join(',');
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/recommendations',
          { skills: skills_array[skills_array.length - 1] }
        );
        setRecommendations(response.data);
        setShowRecommendation(true);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Handle potential errors gracefully
      }
    }
  };

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

  const tryAgain = () => {
    setShowRecommendation(false);
    setCurrentQuestion(0);
  }

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <div className='bg-slate-100 p-12 rounded-lg shadow-2xl w-full max-w-xl text-center'>

        {
          showRecommendation ? (
            <>
              <div className='text-slate-700 text-md font-semibold'>
                Here are your recommendations:

                <div className="mb-2 text-green-900">
                  {recommendations.length > 0 && (
                    <ul>
                      {recommendations.map((recommendation, index) => (
                        <li key={index} className='bg-slate-700 rounded-md m-2 text-white hover:bg-blue-500 hover:shadow-xl transition-all duration-500'>{recommendation}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <br />
              <div>
                Do you want to take the career quiz again?
                <button onClick={() => tryAgain()} className='m-2 h-10 w-24 rounded-md bg-slate-200 hover:bg-slate-100 hover:shadow-xl transition-all duration-500'>try again</button>
              </div>

            </>
          ) : (
            <>
              <div className='text-slate-700 font-semibold'>
                <div className='m-4'>
                  <span className='text-lg'>Please respond truthfully...</span>
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
                      {
                        currentQuestion < allQuestions.length - 1 ?
                          <button onClick={() => handleNext()} className='m-2 h-10 w-24 rounded-md bg-slate-200 hover:bg-slate-100 hover:shadow-xl transition-all duration-500 ease-in-out'>next</button>
                          :
                          <button onClick={() => handleRecommendations()} className='m-2 p-2 rounded-lg bg-green-500 hover:shadow-xl hover:bg-green-300 transition-all duration-500 ease-in-out'>show recommendation</button>
                      }

                      {/* {console.log(skills_array)} */}
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