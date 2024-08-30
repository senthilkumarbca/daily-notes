import Expense from "./expense.js";

const content = document.getElementById("main");
const newBtn = document.getElementById("new-btn");
const backBtn = document.getElementById("back-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-expenses");
const sideNav = document.getElementById("side-nav");
const menuBtn = document.getElementById("menu-btn");
const menuCloseBtn = document.getElementById("menu-close-btn");
const title = document.getElementById("title");
const notifyElement = document.getElementById("notification");

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;

localStorage.setItem(
  "expenseCategories",
  JSON.stringify(["food", "snacks", "basic", "movie"])
);

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const notify = (message, color) => {
  notifyElement.innerText = message;
  notifyElement.style.display = "block";
  notifyElement.style.color = color;
  setTimeout(() => {
    notifyElement.style.display = "none";
  }, 1000);
};

const addRecord = async (formData) => {
  const itemName = formData.get("itemName");
  const price = formData.get("price");
  const date = formData.get("date");
  const category = formData.get("category");

  const expense = new Expense({ itemName, price, category, date });
  expense
    .save()
    .then((message) => {
      notify(message, "green");
      renderExpensesList(expense.date);
    })
    .catch((error) => {
      notify(error.message, "red");
    });
};

const updateRecord = async (formData) => {
  const id = formData.get("expenseId");
  const expense = await Expense.find(Number(id));
  console.log("expenseId => ", expense);
  expense.itemName = formData.get("itemName");
  expense.price = formData.get("price");
  expense.date = formData.get("date");
  expense.category = formData.get("category");

  expense
    .update()
    .then((message) => {
      notify(message, "green");
      document.getElementById("notification").style.display = "block";
      renderExpensesList(expense.date);
    })
    .catch((error) => {
      notify(error.message, "red");
    });
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const action = formData.get("action");
  if (action == "new") {
    addRecord(formData);
  } else if (action == "edit") {
    updateRecord(formData);
  }
  console.log("insde hadel form", formData.get("action"));
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const renderExpensesList = async (selectedDate = formattedDate) => {
  console.log("selectedDate -> ", selectedDate);
  newBtn.style.display = "block";
  backBtn.style.display = "none";
  editBtn.style.display = "none";
  deleteBtn.style.display = "none";
  title.innerText = "Expenses";

  const expenses = await Expense.allByDate(selectedDate);

  console.log("expenses -> ", expenses);

  const totalPrice = expenses.reduce(
    (total, expense) => total + Number(expense.price),
    0
  );
  content.innerHTML = `
        <div class="expenseListheader">
        <input type="date" id="date-filter" value="${selectedDate}">
        <p>&#8377; ${totalPrice}</p>
        </div>
        <div class="expenseList">
        <div class="wrapper">
        <ul class="card card-1"></ul>
        <ul class="card card-2">
            ${expenses
              .map(
                (expense) => `
                <li class="expense-item" data-id="${expense.id}">
                    <p class="itemName">${expense.itemName}</p>
                    <p class="prrice">&#8377; ${expense.price}</p>
                </li>
            `
              )
              .join("")}
        </ul>
        <ul class="card card-3"></ul>
        </div>
        </div>
    `;

  document.getElementById("date-filter").addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    renderExpensesList(selectedDate);
  });

  const wrapper = document.querySelector(".wrapper");
  const cards = wrapper.querySelectorAll(".card");
  const firstCard = cards[0];
  wrapper.scrollLeft = firstCard.offsetLeft;
  // let lastScrollLeft = wrapper.scrollLeft;
  let lastVisibleCardIndex = -1;
  let isScrolling;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Function to determine which card is visible
  // Function to determine which card is fully visible
  function getFullyVisibleCardIndex() {
    const cards = wrapper.querySelectorAll(".card");
    const wrapperRect = wrapper.getBoundingClientRect();

    for (let i = 0; i < cards.length; i++) {
      const cardRect = cards[i].getBoundingClientRect();
      if (
        cardRect.left >= wrapperRect.left &&
        cardRect.right <= wrapperRect.right
      ) {
        return i;
      }
    }
    return -1;
  }

  // Debounce function to limit how often the callback is executed
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function handleScrollEnd() {
    const visibleCardIndex = getFullyVisibleCardIndex();

    if (visibleCardIndex !== lastVisibleCardIndex) {
      console.log(`Fully visible card changed to index: ${visibleCardIndex}`);

      if (visibleCardIndex === 0) {
        // If the first card is fully visible, add a new card
        // addNewCard();
        const parsedDate = new Date(selectedDate);
        const prevDate = new Date(parsedDate);
        prevDate.setDate(parsedDate.getDate() - 1);
        const previousDate = formatDate(prevDate);
        console.log("Previous date -> ", previousDate);
        renderExpensesList(previousDate);
      } else if (visibleCardIndex === 2) {
        const parsedDate = new Date(selectedDate);
        const nextDate = new Date(parsedDate);
        nextDate.setDate(parsedDate.getDate() + 1);
        const nextDateFormatted = formatDate(nextDate);
        console.log("Next date -> ", nextDateFormatted);
        renderExpensesList(nextDateFormatted);
      }

      lastVisibleCardIndex = visibleCardIndex;
    }
  }

  // Scroll event listener with debounce
  wrapper.addEventListener(
    "scroll",
    debounce(() => {
      isScrolling = true;

      // Stop scrolling check after a short delay
      setTimeout(() => {
        if (isScrolling) {
          handleScrollEnd();
          isScrolling = false;
        }
      }, 100); // Adjust the debounce delay as needed
    })
  );

  // Initial setup to ensure the second card is visible by default
  // const cards = wrapper.querySelectorAll(".card");
  if (cards.length > 1) {
    const cardIndex = isMobile ? 1 : 0;
    const secondCard = cards[cardIndex];
    wrapper.scrollLeft = secondCard.offsetLeft;
  }
};

const showExpense = async (id) => {
  const expense = await Expense.find(id);
  newBtn.style.display = "none";
  backBtn.style.display = "block";
  editBtn.style.display = "block";
  deleteBtn.style.display = "block";
  title.innerText = "Expense";
  editBtn.setAttribute("data-id", expense.id);
  deleteBtn.setAttribute("data-id", expense.id);

  content.innerHTML = `
        <div class="show-expense">
        <h3>${expense.itemName}</h3>
        <p>${expense.category}</p>
        <p>${expense.price}</p>
        <p>${expense.date}</p>
        </div>
    `;
};

const renderExpenseFrom = (action, expense) => {
  newBtn.style.display = "none";
  backBtn.style.display = "block";
  editBtn.style.display = "none";
  deleteBtn.style.display = "none";
  title.innerText = `${capitalize(action)} Expense`;
  content.innerHTML = `
    <form id="expenseForm">
        <input type="hidden" name="action" id="action" value="${action}">
        <input type="hidden" name="expenseId" id="expenseId" value="${
          expense.id
        }">
        <div class="form-item">
            <label for="itemName">Name</label>
            <input type="text" name="itemName" id="itemName" value="${
              expense.itemName
            }" required>
        </div>
        <div class="form-item">
            <label for="price">Price</label>
            <input type="number" name="price" id="price" value="${
              expense.price
            }" required>
        </div>
        <div class="form-item">
            <label for="category">Category</label>
            <select id="category" name="category" required></select>
        </div>
        <div class="form-item">
            <label for="date">Date</label>
            <input type="date" id="date" name="date" value="${
              expense.date
            }" required>
        </div>
        <div class="form-item">
            <button type="submit">${
              action == "new" ? "Save" : "Update"
            }</button>
        </div>
    </form>
    `;

  const categorySelect = document.getElementById("category");
  const categories =
    JSON.parse(localStorage.getItem("expenseCategories")) || [];

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Select a category";
  categorySelect.appendChild(emptyOption);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });

  categorySelect.value = expense.category.toLowerCase();
  if (action == "new") {
    document.getElementById("date").value = formattedDate;
  }

  //   document
  //     .getElementById("backBtn")
  //     .addEventListener("click", renderExpensesList);

  document
    .getElementById("expenseForm")
    .addEventListener("submit", handleFormSubmit);
};

const newExpense = async (event) => {
  console.log("inside renderAddForm func..");
  const expense = new Expense({});
  console.log("inside renderAddForm func..", expense);
  renderExpenseFrom("new", expense);
};

const editExpense = async (id) => {
  console.log("inside edit func..", id);
  const expense = await Expense.find(id);
  console.log("inside edit func..", expense);
  renderExpenseFrom("edit", expense);
};

const deleteExpense = async (id) => {
  const doDelete = confirm("Are you Sure, you wnat to delete this record!");
  if (doDelete) {
    const expense = await Expense.find(Number(id));
    expense
      .destroy()
      .then((message) => {
        notify(message, "green");
        renderExpensesList();
      })
      .catch((error) => {
        notify(error.message, "red");
      });
  }
};

const exportExpenses = async () => {
  try {
    await Expense.export();
    console.log("Expenses exported successfully.");
  } catch (error) {
    console.error("Error exporting expenses:", error);
  }
};

content.addEventListener("click", (event) => {
  const clickedItem = event.target.closest(".expense-item");
  if (clickedItem) {
    const id = Number(clickedItem.getAttribute("data-id"));
    showExpense(id);
  }
  if (event.target && event.target.matches("#editBtn")) {
    const id = Number(event.target.getAttribute("data-id"));
    editExpense(id);
  }
  if (event.target && event.target.matches("#deleteBtn")) {
    const id = Number(event.target.getAttribute("data-id"));
    deleteExpense(id);
  }
  if (event.target && event.target.matches("#backBtn")) {
    renderExpensesList();
  }
});

newBtn.addEventListener("click", newExpense);
backBtn.addEventListener("click", () => {
  renderExpensesList();
});
editBtn.addEventListener("click", (event) => {
  const id = Number(event.target.getAttribute("data-id"));
  editExpense(id);
});

deleteBtn.addEventListener("click", (event) => {
  const id = Number(event.target.getAttribute("data-id"));
  deleteExpense(id);
});

menuBtn.addEventListener("click", (event) => {
  sideNav.style.width = "60%";
});

menuCloseBtn.addEventListener("click", (event) => {
  sideNav.style.width = "0";
});

exportBtn.addEventListener("click", (event) => {
  exportExpenses();
});

renderExpensesList();
