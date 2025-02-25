const foodCardTemplate = document.querySelector("[data-food-card-template]")


fetch("https://jsonplaceholder.typicode.com/users")
.then(res => res.json())
.then(data => {
    data.forEach(user => {
        const card = foodCardTemplate.content.cloneNode(true).children[0]
        console.log(card)
    })
});