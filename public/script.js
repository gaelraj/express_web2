const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if(id){
    fetch('/characters/'+id)
  .then(response => response.json())
  .then(data => {
    const charactersList = document.getElementById("container");
    charactersList.innerHTML += `
      <div class="max-w-md mx-auto bg-gradient-to-br from-indigo-100 to-white border-l-8 border-indigo-500 rounded-2xl shadow-xl overflow-hidden m-6 p-6 transition-transform hover:scale-105 hover:shadow-2xl">
        <div class="flex flex-col items-center">
          <h2 class="text-2xl font-bold text-indigo-700 mb-1">${data.name}</h2>
          <span class="text-sm text-gray-500 mb-2">ID: ${data.id}</span>
        </div>
        <div class="mt-4 space-y-2">
          <div class="text-gray-700"><span class="font-semibold text-indigo-700">Real Name:</span> ${data.realName}</div>
          <div class="text-gray-700"><span class="font-semibold text-indigo-700">Universe:</span> ${data.universe}</div>
        </div>
      </div>
    `;
  })   
}else{
  
  fetch("/charactersData")
  .then(response => response.json())
  .then(data => {
    const charactersList = document.getElementById("container");
    const characters = data.characters;
    characters.forEach(character => {
        charactersList.innerHTML += `
        <div class="max-w-xs bg-white rounded-xl shadow-lg overflow-hidden m-4 transition-transform hover:scale-105 hover:shadow-2xl">
          <div class="flex items-center p-4">
            <div>
              <div class="text-xl font-semibold text-indigo-700">${character.name}</div>
              <div class="text-sm text-gray-500">ID: ${character.id}</div>
            </div>
          </div>
          <div class="px-4 pb-4">
            <div class="text-gray-700 mb-2"><span class="font-medium text-gray-900">Real Name:</span> ${character.realName}</div>
            <div class="text-gray-700"><span class="font-medium text-gray-900">Universe:</span> ${character.universe}</div>
          </div>
        </div>
      `;
      
    })
  })
}
