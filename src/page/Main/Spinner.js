import "./Spinner.css";
function Spinner() {
  return (
    <div className="container">
      <svg className="circle-svg" height="200" width="200">
        <circle cx="100" cy="100" r="50"></circle>
      </svg>
    </div>
  );
}

export default Spinner;
