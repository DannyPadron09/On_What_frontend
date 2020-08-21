let lureContainer = document.getElementById('fishing-lures')
let formContainer = document.getElementById('myForm')


const luresAdapter = new LureAdapter('http://localhost:3000/lures')

luresAdapter.showAllLures()
.then(function(lures) {
    lures.forEach(function(lure) {
        lureContainer.innerHTML += allTheLures(lure)
    })
})

function allTheLures(lure) {
    return `
    <div id=lure-${lure.id}>
        <div id=lure-${lure.id}-info>
            <p id=brand><strong>Brand:</strong> <span>${lure.brand}</span></p>
            <p id=model><strong>Model:</strong> <span>${lure.model}</span></p>
            <p id=color><strong>Color:</span></strong> <span>${lure.color}</span></p>
            <p id=quantity><strong>Quantity:</strong> <span>${lure.quantity}</span></p> 
        </div>
            <ul id='fish-caught-on-${lure.id}'>
            <strong>Fish Caught on this Lure:</strong><br><br>
            ${lure.fishes.map(function(fish) {return `<li id=${fish.id}>${fish.species} - ${fish.weight}</li>`}).join('')}
            </ul>
            <button id='add-fish-to-${lure.id}' class='add-fish' data-lure=${lure.id}>Add Fish</button>
            <button id='edit-button-${lure.id}' class='edit-button' data-lure=${lure.id}>Edit Lure</button>
    </div><br><br>
    `
}

// GENERATE FORMS AND ADD FISH

lureContainer.addEventListener('click', function(e) {

    if (e.target.className == 'edit-button'){
        e.target.disabled = true 
        let lureInfo = document.getElementById(`lure-${e.target.dataset.lure}-info`)
        let info = [e.target.dataset.lure]
        lureInfo.querySelectorAll('span').forEach(function(span){
            info.push(span.innerText)
        })
        lureInfo.innerHTML = generateForm(info)
    } 

    if (e.target.className == 'add-fish') {
        let info = [e.target.dataset.lure]
        let fishInfo = document.getElementById(`fish-caught-on-${info}`)
        fishInfo.innerHTML += generateFishForm(info)
    }

    if (e.target.className == 'make-fish') {
        e.target.disabled = true
        let fishForm = document.getElementById('fish-form')
        let caughtFish = document.getElementById(`fish-caught-on-${fishForm.dataset.lure}`)
        let info = []
        fishForm.querySelectorAll('input').forEach(function(input) {
            info.push(input.value)
        })
        let fishBody = {
            species: info[0],
            weight: info[1],
            lure_id: (fishForm.dataset.lure)
        }
        luresAdapter.addFish(fishBody)
        .then(function(fish) {
            caughtFish.innerHTML += `<li>${fish.species} - ${fish.weight}</li>`
        })
        fishForm.style.visibility = 'hidden'
    }
})

// ADDING LURE

formContainer.addEventListener('submit', function(e) {
    e.preventDefault() 
    let formInfo = document.getElementById('myForm')
    let info = []
    formInfo.querySelectorAll('input').forEach(function(input) {
        info.push(input.value)
    })
    let lureBody = {
        lure: {
            brand: info[0],
            model: info[1],
            color: info[2],
            quantity: info[3]
        }
    }
    e.target.reset()
    
    luresAdapter.addNewLure(lureBody)
    .then(function(lure) {
        lureContainer.innerHTML += `
        <div id=lure-${lure.id}>
            <div id=lure-${lure.id}-info>
                <p id=brand><strong>Brand:</strong> <span>${lure.brand}</span></p>
                <p id=model><strong>Model:</strong> <span>${lure.model}</span></p>
                <p id=color><strong>Color:</span></strong> <span>${lure.color}</span></p>
                <p id=quantity><strong>Quantity:</strong> <span>${lure.quantity}</span></p> 
                <ul id='fish-caught-on-${lure.id}'>
                <strong>Fish Caught on this Lure:</strong><br><br>
                </ul>
            <button id='add-fish-to-${lure.id}' class='add-fish' data-lure=${lure.id}>Add Fish</button>
            <button id='edit-button-${lure.id}' class='edit-button' data-lure=${lure.id}>Edit Lure</button>
            </div>
        </div>
        ` 
    })
})

// EDIT LURE 

lureContainer.addEventListener('submit', function(e) {
    e.preventDefault()
    debugger
    if (e.target.className == 'edit-form'){
        let lureId = e.target.dataset.lure
        let lureInfo = document.getElementById(`lure-${lureId}-info`)
        let info = []
        e.target.querySelectorAll('input').forEach(function(input) {
            info.push(input.value)
        })
        let lureBody = {
            lure: {
                brand: info[0],
                model: info[1],
                color: info[2],
                quantity: info[3]
            }
        }
        luresAdapter.editLure(lureBody, lureId)
        .then(function(lure) {
            lureInfo.innerHTML = `
                <div id=lure-${lureId}-info>
                    <p id=brand><b>Brand:</b><span>${info[0]}</span></p>
                    <p id=model><b>Model:</b><span>${info[1]}</span></p>
                    <p id=color><b>Color:</b><span>${info[2]}</span></p>
                    <p id=quantity><b>Quantity:</b><span>${info[3]}</span></p>
                </div>`
        })
        document.getElementById(`edit-button-${lureId}`).disabled = false
    }

    
})


// FORMS


function generateForm(info) {
    return `
        
        <form class="edit-form" data-lure=${info[0]}>
            <label for="Brand"><b>Brand</b></label>
            <input type="text" name="brand" value='${info[1]}'>
            <br>
            <label for="model"><b>Model</b></label>
            <input type="text" name="model" value='${info[2]}'>
            <br>
            <label for="color"><b>Color</b></label>
            <input type="text" name="color" value='${info[3]}'>
            <br>
            <label for="quantity"><b>Quantity</b></label>
            <input type="text" name="quantity" value='${info[4]}'>
            <br>
            <input class=edit-form type=submit value='Submit'>
        </form>
    `
}

function generateFishForm(info) {
    return `
        <form class="fish-form" id="fish-form" data-lure=${info}>    
            <label for="Species"><b>Species</b></label>
            <input type="text" name="species" value="Species">
            <label for="weight"><b>Weight</b></label>
            <input type="text" name="weight" value="Weight">
            <input class="make-fish" type="submit" value='Submit'>
        </form>
    `
}

