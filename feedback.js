selected = [];

//el is element to create checkbox selections in
//options is to what are the choices to select from
//info is informaton to pass along with selections, when
let testInfo = 	{
                  "lotName": "Electrical Engineering Lot",
                  "userId": "gheiufajsdflas-djfasd-lfj"
                }

function createSelectors(el,options){
  el.innerHTML = `<div class="selector-header">${testInfo.lotName}<div>`;
  let i = 1;
  for(o of options){
    el.innerHTML += `<div class="selector">
                        <div class="selector selector-text">${o}</div>
                        <input value="${o}" type="checkbox" onclick="selectThis(this.value)"></input>
                     </div>`;
    if(i < options.length){
      el.innerHTML += `<li class="selector-border selector"></li>`;
    }
    i += 1;
  }
  if(options.length > 0){
    el.innerHTML += `<button class="selector-submit" onclick="submitSelected(this)">Submit</button>`
  }
}

function submitSelected(el){
  if(selected.length > 0){
    feedback = {
      createdAt: Math.floor(new Date().getTime()/1000),
      lotName: testInfo.lotName,
      userID: testInfo.userId,
      feedback: selected,
      status: "",
    };
    xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/feedback", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(feedback));
  }
}

function selectThis(val){
  selected.push(val);
}

let url = "https://us-central1-parkzen-33bc1.cloudfunctions.net/Feedback?name=getFeedbackQueries"
let result = fetch(url, {mode: 'no-cors'});
console.log(result);

createSelectors(document.getElementById("feedbacks"),["Too Crowded","Infrastructure Damages","Missing Signs","Obstacles/Blockages"],testInfo);
