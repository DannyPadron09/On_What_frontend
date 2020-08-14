class LureAdapter {
    constructor(url) {
        this.baseUrl = url 
    }

    showAllLures() {
        return fetch(this.baseUrl)
        .then(res => res.json())
    }

    editLure(lureBody, lureId) { 
        return fetch((`${this.baseUrl}/${lureId}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(lureBody)
        })
    }

    addNewLure(lureBody) {
        return fetch((`${this.baseUrl}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(lureBody)
        })
        .then(res => res.json())
    }

    addFish(fishBody) {
        return fetch(('http://localhost:3000/fish'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(fishBody)
        })
        .then(res => res.json())
    }

}

