import "./styles.css";

class FetchUsers {
  constructor(url) {
    this.url = url;
  }
  async getUsers() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error(`Ошибка при получении пользователей: ${error}`);
    }
  }
}
class UserCard {
  constructor(user) {
    this.user = user;
  }

  renderCard() {
    const card = document.createElement("div");
    card.classList.add("main-card");
    card.setAttribute("data-id", this.user.id);
    card.innerHTML = `
      <div class='main-card-title'>
        <h2>${this.user.name}</h2>
        <h2>${this.user.username}</h2>
      </div>
      <div class='main-card-email'>
        <h3><span>Mail:</span>${this.user.email}</h3>
      </div>
      <div class='main-card-list address'>
          <span>Address:</span>
          <ul class='main-card-ul'>
            <li class='main-card-li'><span>Street:</span>${this.user.address.street}</li>
            <li class='main-card-li'><span>Suite:</span>${this.user.address.suite}</li>
            <li class='main-card-li'><span>City:</span>${this.user.address.city}</li>
            <li class='main-card-li'><span>Zipcode:</span>${this.user.address.zipcode}</li>
            <li class='main-card-li'>
              <span>Geo:</span>
              <div class='main-card-li-geo'>
                <p>${this.user.address.geo.lat}</p>
                <p>${this.user.address.geo.lng}</p>
              </div>
            </li>
          </ul>
      </div>
      <div class='main-card-phone'>
        <h3><span>Phone:</span>${this.user.phone}</h3>
      </div>
      <div class='main-card-website'>
        <h3><span>Website:</span>${this.user.website}</h3>
      </div>
      <div class='main-card-list company'>
        <span>Company:</span>
        <ul class='main-card-ul'>
          <li class='main-card-li'><span>Name:</span>${this.user.company.name}</li>
          <li class='main-card-li'><span>Catch Phrase:</span>${this.user.company.catchPhrase}</li>
          <li class='main-card-li'><span>BS:</span>${this.user.company.bs}</li>
        </ul>
      </div>
    `;
    return card;
  }
}
class UserSearch {
  constructor(users, inputElement) {
    this.users = users;
    this.inputElement = inputElement;
  }

  filterUsers(searchValue) {
    const filterValue = searchValue.toLowerCase();
    return this.users.filter((user) => {
      switch (true) {
        case user.name.toLowerCase().includes(filterValue):
        case user.username.toLowerCase().includes(filterValue):
        case user.email.toLowerCase().includes(filterValue):
        case user.address.street.toLowerCase().includes(filterValue):
        case user.address.suite.toLowerCase().includes(filterValue):
        case user.address.city.toLowerCase().includes(filterValue):
        case user.address.zipcode.toLowerCase().includes(filterValue):
        case user.address.geo.lat.toLowerCase().includes(filterValue):
        case user.address.geo.lng.toLowerCase().includes(filterValue):
        case user.phone.toLowerCase().includes(filterValue):
        case user.website.toLowerCase().includes(filterValue):
        case user.company.name.toLowerCase().includes(filterValue):
        case user.company.catchPhrase.toLowerCase().includes(filterValue):
        case user.company.bs.toLowerCase().includes(filterValue):
          return true;
        default:
          return false;
      }
    });
  }

  addSearchEvent(renderFilteredUsers) {
    this.inputElement.addEventListener("input", () => {
      const filterValue = this.inputElement.value;
      const filteredUsers = this.filterUsers(filterValue);
      renderFilteredUsers(filteredUsers);
    });
  }
}
class UserRender {
  constructor(fetchUsers, containerID) {
    this.fetchUsers = fetchUsers;
    this.container = document.getElementById(containerID);
    this.users = [];
  }

  async renderUserCard() {
    this.users = await this.fetchUsers.getUsers();

    if (this.users) {
      const filterInput = document.getElementById("filter-input");
      const userSearch = new UserSearch(this.users, filterInput);
      this.renderFilteredUsers(this.users);
      userSearch.addSearchEvent(this.renderFilteredUsers.bind(this));
    }
  }

  renderFilteredUsers(users) {
    this.container.innerHTML = "";
    users.forEach((user) => {
      const userCard = new UserCard(user);
      const cardElement = userCard.renderCard();
      this.container.appendChild(cardElement);
    });
  }
}

const url = "https://jsonplaceholder.typicode.com/users";
const fetchUsers = new FetchUsers(url);

const userRender = new UserRender(fetchUsers, "cards-id");
userRender.renderUserCard();
