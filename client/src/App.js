import {useState} from 'react';
function App() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function showError(message) {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    if (!validateEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    const serverURL = process.env.REACT_APP_ENVIRONMENT === "development" ? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_PROD_SERVER_URL;
    fetch(serverURL + "/collect-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setIsEmailSubmitted(true);
      } else {
        setError(data.message);
      }
    }
    ).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
    {error && <div className='bg-red-200 text-red-800 p-5 text-center'>{error}</div>}
    <div className="App h-screen grid text-center place-content-center">
      <section className=" flex flex-col gap-10">
        <h1 className="text-6xl font-bold">notetaker</h1>
        <p className="text-3xl max-w-3xl">Record lecture audio and generate notes instantly.</p>
        <div style={{width: 'fit-content', margin: 'auto'}}>
          <ul>
            <li className="list-disc text-left">Professor doesn't record lecture?</li>
            <li className="list-disc text-left">Zoned out in class and missed something important?</li>
            <li className="list-disc text-left">Too lazy to take notes?</li>
          </ul>
        </div>
        {
          isEmailSubmitted ? 
            <p>Thanks for signing up! We'll be in touch.</p> : 
            <form className="flex justify-center" onSubmit={handleEmailSubmit}>
              <input placeholder="Enter email address" className="border-none bg-gray-200 p-2 focus:outline-none"/>
              <button className="text-white bg-black p-2">Get Early Access</button>
            </form>

        }
        
        <div className="text-center">
          <img className="m-auto" src={require("./img/notes.jpg")} alt="notetaker" />
        </div>
      </section>
    </div>
    </>
    
  );
}

export default App;
