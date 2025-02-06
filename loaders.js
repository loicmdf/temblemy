function LoadHeader() {
    const headerfile = window.innerHeight > window.innerWidth ? "/temblemy/parts/header2.html" : "/temblemy/parts/header.html";
    console.log(headerfile);
    fetch(headerfile)
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading header:", error));
}
function LoadFooter() {
    fetch("/temblemy/parts/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading header:", error));
}
async function writeBook(book) {
    const description = book.description.length > 600 ? book.description.substring(0, 600) + "..." : book.description;
    document.getElementsByClassName("book-list").item(0).insertAdjacentHTML("beforeend", `
        <button class="bookItem" title="${book.title}\nAuthor: ${book.author}\nPublished: ${book.year}\nPrice: $${book.price}" id="${book.id}" 
        style="border: 2px solid #000;
                cursor: pointer;"
                onclick="window.location.href = '/temblemy/delivery.html?id=${book.id}'"
                onmouseover="this.style.border = '2px solid #AAA'"
                onmouseout="this.style.border = '2px solid #000'">
            <div class="bookItemImg" style="
                 width: 250px;
                 height: 350px;
                 background: url('${book.image}');
                 background-size: cover;
                 background-repeat: no-repeat;
                 background-position: center;">
                 <span class="bookItem-description">${description}</span>
            </div>
            <div style="background-color: black; width: 100%; padding: 10px 0;">
                <p class="price" style="font-size: 20px; font-weight: bold; margin: 0; color: white;">Price: $${book.price}</p>
            </div>
        </button>
    `);
}
async function displayBooks(type) {
    fetch("/temblemy/data/books.json")
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                if (book.type === type) {
                    writeBook(book);
                    fixBookOrientation();
                }
            })
        })
        .catch(error => console.error("Error fetching data:", error));
}
async function getBook(id) {
    return fetch("/temblemy/data/books.json")
        .then(response => response.json())
        .then(books => {
            for (const book of books) {
                if (book.id === id) {
                    console.log("Book ID: ", book.id);
                    return book;
                }
            }
            return null;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            return null;
        });
}

async function fixBookOrientation() {
    const booklist = document.getElementById('book-list');
    if (window.innerHeight > window.innerWidth) {
        booklist.style.marginTop = 120 + "px";
        booklist.style.flexDirection = "column";
        booklist.style.overflowY = "auto";
    } else {
        booklist.style.marginTop = "0";
        booklist.style.flexDirection = undefined;
        booklist.style.overflowY = undefined;
    }
}

function displayBookByName(name) {
    const regexPattern = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".");
    const regex = new RegExp(regexPattern, "i");
    fetch("/temblemy/data/books.json")
        .then(response => response.json())
        .then(books => {
            let count = 0;
            books.forEach(book => {
                if (regex.test(book.title) || regex.test(book.author) || regex.test(book.description)) {
                    writeBook(book);
                    fixBookOrientation();
                    count++;
                }
            })
            document.getElementById("search-input").placeholder = "Found " + count + " results...";
        })
        .catch(error => console.error("Error fetching data:", error));
}
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdown");
    if (event.target.id === "search-button") {
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = "search.html?s=" + query;
            }
        }
    }
    else if (event.target.id === "browse-button") {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
    else {
        dropdown.style.display = "none";
    }
});
document.addEventListener("keypress", function(event) {
    if (event.target.id === "search-input" && event.key === "Enter") {
        document.getElementById("search-button").click();
    }
});
