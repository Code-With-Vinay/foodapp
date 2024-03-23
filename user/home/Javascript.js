let scriptUrl =("https://script.google.com/macros/s/AKfycbxMti0eklZPtrsXl5M2oIozI9DL2ayoGoQo-1sxWJ8hXu_6mfpso79ljx31QvZem3Zc/exec");
async function fetchTableData() {
        const response = await fetch(scriptUrl);
        const data = await response.json();
        document.querySelectorAll('.hideonload').forEach(element => {
        element.classList.add('active');
    }); 
        return data;
}


document.addEventListener('DOMContentLoaded', async () => {  
    displayCartItems()
    updateCartTotal()
    var name = localStorage.getItem("name:")
    var mbl = localStorage.getItem("mobile:")
    var address = localStorage.getItem("address:")

       document.getElementById('Complete_address').value = address
       document.getElementById('enter-name').value  = name
       document.getElementById('mobile').value = mbl
       document.getElementById('locationName').innerHTML = name
       document.getElementById('address').innerHTML = address
 //-----------------------------------------------------------------------
    const userEmail = localStorage.getItem('userEmail');
    document.getElementById('user-uid').textContent = userEmail
  const logoutButton = document.getElementById('logout-btn');
  logoutButton.addEventListener('click', clearSession);
  if (!userEmail) {
      navigateToLogin();
      return;
  }

    function clearSession() {
    document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    localStorage.removeItem('userEmail');
    navigateToLogin();
  }
  
  function navigateToLogin() {
    const linkHref = '/';
    window.location.href = linkHref;
  }

    const userPcImg = document.querySelector('.user-pc-img');
    const userMenuCloseBtn = document.querySelector('.user-close-icon ');
    const subMenuWrap = document.querySelector('.sub-menu');
  
    userPcImg.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '350px';
        subMenuWrap.classList.add('active')
    });
  
    userMenuCloseBtn.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '10px';
        subMenuWrap.classList.remove('active')
    });
  

    const menuData = await fetchTableData();
    class Order {
        constructor() {
            this._menu = [];
            
        }

        get menu() {
            return this._menu;
            
        }

        set menu(menuArray) {
            this._menu = menuArray.map(menuItem => ({
                name: menuItem[0],
                image: menuItem[1],
                location: menuItem[2],
                time: menuItem[3], 
                
    }));
        }

    }
    class Ui {
        static menu(orderInstance) {
            const frag = document.createDocumentFragment();
            const searchList = [];
            orderInstance.menu.forEach(item => {
                const node = document.createElement("div");
                node.className = "dashboard-card";
                node.setAttribute("data-name", `${item.name}`);
                node.setAttribute("data-tag", `${item.datacategory}`);
                node.innerHTML = `
                    <span class="offer"></span>
                    <img class="card-image" src="${item.image}">
                    <div class="card-detail">
                        <h4 class="name">${item.name}</h4>
                        <p class="description">${item.location}</p>
                        <p class="card-time"><span class="fas fa-clock"> ${item.time} Mins</span></p>
                    </div> `;
                frag.appendChild(node);
                searchList.push(item.name);
                
            });
            document.getElementById('dashboard-content').appendChild(frag);
            Ui.generateSearchlist(searchList);
            const dashboardCards = document.getElementsByClassName('dashboard-card');
            for (const button of dashboardCards) {
                button.addEventListener('click', addToCartClicked);
            }
        }

        static generateSearchlist(suggestions) {
            const searchWrapper = document.querySelector(".input-box");
            const inputBox = searchWrapper.querySelector("input");
            const autocomBox = document.querySelector('.autocom-box');
    
            // if user press any key and release
            inputBox.addEventListener('input', function (e) {
                let userData = e.target.value.toLowerCase(); // user entered data
                let emptyArray = [];
            
                if (userData) {
                    emptyArray = suggestions.filter((data) => {
                        return data.toLowerCase().includes(userData);
                    });
                    showSuggestions(emptyArray);
                    searchWrapper.classList.add("active"); // show autocomplete box
                } else {
                    searchWrapper.classList.remove("active"); // hide autocomplete box
                    showDashboardCards("All"); // Show all dashboard cards when input is cleared
                }
            });
    
            // Handle click events on suggestions
            autocomBox.addEventListener('click', function (e) {
                const selectedSuggestion = e.target.textContent;
                if (selectedSuggestion) {
                    inputBox.value = selectedSuggestion;
                    searchWrapper.classList.remove("active");
                    
                    // Call a function to filter and show relevant dashboard cards based on the selected suggestion
                    showDashboardCards(selectedSuggestion);
                }
            });
    
            function showSuggestions(list) {
                let listData;
                if (!list.length) {
                    listData = `<li>No suggestions found</li>`;
                } else {
                    listData = list.map(data => `<li>${data}</li>`).join('');
                }
                autocomBox.innerHTML = listData;
            }
    
            function showDashboardCards(selectedSuggestion) {
                const dashboardCards = document.querySelectorAll('.dashboard-card');
                dashboardCards.forEach(dashboardCard => {
                    dashboardCard.style.display = "none";
                    const cardName = dashboardCard.getAttribute('data-name');
                    const cardTag = dashboardCard.getAttribute('data-tag');
                    
                    if (cardName === selectedSuggestion || selectedSuggestion === "All" || cardTag === selectedSuggestion) {
                        dashboardCard.style.display = 'block';
                    }
                });
            }
        }
    }

    const order = new Order();
    order.menu = menuData;
    Ui.menu(order);
});



function addToCartClicked(event) {
    const card = event.target;
    const cardparent = card.parentNode;
    const name = cardparent.querySelector('.name').innerText;
    fetchRestaurantMenu(name)
}

async function fetchRestaurantMenu(name) {
        const encodedName = encodeURIComponent(name);
        const menuScriptUrl = "https://script.google.com/macros/s/AKfycbxMti0eklZPtrsXl5M2oIozI9DL2ayoGoQo-1sxWJ8hXu_6mfpso79ljx31QvZem3Zc/exec?menu=" + encodedName;
        const menuResponse = await fetch(menuScriptUrl);
        const menuFetched = await menuResponse.json();
        localStorage.setItem('menuUrl', menuScriptUrl);
        navigateToMenu()
        return menuFetched;
}

  function clearSession() {
  localStorage.removeItem('userEmail');
  navigateToMenu();
}

function navigateToMenu() {
  const linkHref = '/user/resturants/';
  window.location.href = linkHref;
}


function displayCartItems() {
    const cartItemsContainer = document.querySelector('.order-wrapper');
    cartItemsContainer.innerHTML = ''; // Clear existing items
    
    // Retrieve cart items from localStorage
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Display each cart item
    cartItems.forEach(item => {
        const cartRow = document.createElement('div');
        cartRow.innerHTML = `
            <div class="order-card">
                <img src="${item.img}" class="order-image">
                <div class="order-detail">
                    <p class="name">${item.name}</p>
                    <i class="fas fa-times"></i> <input class="order-quantity" type="text" value="1">
                </div>
                <span class="order-price">${item.cost}</span>
                <button class="order-btn remove-btn"><i class="fa-solid fa-trash-can"></i></button>
            </div>`;
        cartItemsContainer.appendChild(cartRow);
    });
    cartItemContainer.addEventListener('click', removecartitem)
}

const cartItemContainer = document.getElementsByClassName('order-wrapper')[0];


function removecartitem(e){
        e.target.closest('.order-card').remove();
        updateCartTotal(); 
        e.target.localStorage.removeItem('cartItems')

} 


cartItemContainer.addEventListener('change', e => {
    if (e.target.classList.contains('order-quantity')) {
        quantityChanged(e.target);
    }
});

function updateCartTotal() {
    const cartRows = cartItemContainer.getElementsByClassName('order-card');
    let itemTotallabel = document.getElementById('Item-Total');
    let deliveryLabel = document.getElementById('delivery-charges');
    let total = 0;

    for (const cartRow of cartRows) {
        const price = parseFloat(cartRow.querySelector('.order-price').innerText.replace('₹', ''));
        const quantity = parseInt(cartRow.querySelector('.order-quantity').value);
        total += price * quantity;
    }
    if(deliveryLabel.innerHTML === '₹0' || deliveryLabel.innerHTML === '0'){
        deliverychargefrommap = 0
        let totaldelivercharge = deliverychargefrommap
        grandTotal(total, totaldelivercharge);
    } else{
        let totaldelivercharge =  deliveryLabel.innerHTML
        grandTotal(total, totaldelivercharge); 
    }
    itemTotallabel.innerText = `₹${total.toFixed(0)}`;

}


function grandTotal(total, totaldelivercharge) {
    console.log(total)
    console.log(parseFloat(totaldelivercharge))
    console.log(total+ parseFloat(totaldelivercharge))
    const grandTotalValue = parseFloat(total) + parseFloat(totaldelivercharge)
    const grand_total = document.getElementById('grand-total');
    grand_total.innerHTML = '₹' + grandTotalValue

}

function quantityChanged(input, deliverycharge) {
    const value = parseInt(input.value);
    if (isNaN(value) || value <= 0) {
        input.value = 1;
    }
    updateCartTotal(deliverycharge);
}

    var cartCheckbox = document.getElementById('cart');
    var myorderslink = document.getElementById('myOrders');
    var cartLabel = document.querySelector('.label-cart');
    var CloseIcon = document.querySelector('.close-icon');
    var historyCloseIcon = document.querySelector('.history-close-icon');
    var dashboardElement = document.querySelector('.dashboard');
    var dashboardOrderElement = document.querySelector('.dashboard-order');
    var orderhistorydiv = document.querySelector('.order-history');
    var lodainghistory = document.querySelector('.loadwrapper');

    cartLabel.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '350px';
        dashboardOrderElement.classList.add('active')
    })
    CloseIcon.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '10px';
        dashboardOrderElement.classList.remove('active')
    })
    
    
    myorderslink.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '350px';
        orderhistorydiv.classList.add('active')
         loadOrderHistory();
        fetchOrderHistory()
        lodainghistory.style.display = 'flex'
    })
    historyCloseIcon.addEventListener('click', function () {
        dashboardElement.style.paddingRight = '10px';
        orderhistorydiv.classList.remove('active')
        var elementsToRemove = document.getElementsByClassName("history-parent-container");
        Array.from(elementsToRemove).forEach(function(element) {
            element.remove();
        });
    })

        // =====================================================================================
        async function initMap() {

            var centerLocation = { lat: 16.8221, lng: 81.2614 };
            const orderButton = document.querySelector(".button");
            var map = new google.maps.Map(document.getElementById('map'), {
                center: centerLocation,
                zoom: 12,
                gestureHandling: 'greedy'
            });
        
            function drawDeliveryRadiusCircle(map, centerLocation) {
                const deliveryRadius = 7 * 1000; // 10km in meters
                const circleOptions = {
                    strokeColor: '#e75252', // Red color
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    fillColor: '', // Blue color
                    fillOpacity: 0,
                    map: map,
                    center: centerLocation,
                    radius: deliveryRadius,
                    clickable: false,
                    draggable: false,
                    editable: false,
                };
            
                // Create the circle
                const deliveryCircle = new google.maps.Circle(circleOptions);
            
                // Set the pattern for the dotted line
                deliveryCircle.setOptions({ strokeDashstyle: '1 1 1' });
            }
            
            // Assuming your map variable is named 'map'
            drawDeliveryRadiusCircle(map, { lat: 16.8221, lng: 81.2614 });

            var marker = new google.maps.Marker({
                position: centerLocation,
                map: map,
                title: 'Restaurant Location',
                draggable: true
            });

            // Add a click event listener to the marker
            marker.addListener('click', function () {
                map.setZoom(15);
                map.setCenter(marker.getPosition());
                getLocationName(marker.getPosition());
            });
        
            /// Function to calculate the distance between two points using Haversine formula
    function calculateDistance(point1, point2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRadians(point2.lat() - point1.lat());
        const dLng = toRadians(point2.lng() - point1.lng());

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(point1.lat())) * Math.cos(toRadians(point2.lat())) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers

        return distance;
    }

    // Helper function to convert degrees to radians
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Check if the marker is within 10km of the center
    function checkDeliveryRadius(markerPosition) {
        var distance = calculateDistance(new google.maps.LatLng(centerLocation), markerPosition);
            const deliveryChargePerKM = 3
            const deliveryboycharge = 30
            const deliverycharge = (distance * deliveryChargePerKM) + deliveryboycharge;
            console.log(distance)
        if (distance <= 10) {
            // Inside the delivery radius
            orderButton.style.display = 'block'
            document.getElementById('delivery-charges').innerHTML =  deliverycharge.toFixed(0)
        } else {
            alert('Sorry! Deliveries are currently available only within 10-KM Radius')
            orderButton.style.display = 'none'   
        }
    }
    
    // Add a dragend event listener to the marker
    marker.addListener('dragend', function (event) {
        var markerLocation = event.latLng;
        updateCoordinates(markerLocation);
        getLocationName(markerLocation);
        checkDeliveryRadius(markerLocation);
    });

    // Add a click event listener to the map
    map.addListener('click', function (event) {
        marker.setPosition(event.latLng);
        updateCoordinates(event.latLng);
        getLocationName(event.latLng);
        checkDeliveryRadius(event.latLng);
        updateCartTotal()
    });

    
            function updateCoordinates(location) {
                document.getElementById('latcoordinate').value = location.lat().toFixed(6)
                document.getElementById('lngcoordinate').value = location.lng().toFixed(6);
            }
        
            function getLocationName(location) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'location': location }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            var locationName = results[0].formatted_address;
                        } else {
                            console.error('No results found');
                            
                        }
                    } else {
                        console.error('Geocoder failed due to: ' + status);
                    }
                });
                
            }
        }
        
// ===============================================================================================

let latcoordinate= document.getElementById('latcoordinate')
let lngcoordinate = document.getElementById('lngcoordinate')

let location_main_div = document.getElementById('location-main-div')
let SetlocationBtn = document.getElementById('SetlocationBtn')
let dashboard_div = document.querySelector('.dashboard')
let map_div = document.getElementById('map-div')
let L_icon_btn = document.getElementById('icon-btn')
let save_address_button = document.getElementById('save_address_button')


L_icon_btn.addEventListener('click', locationIcon)
save_address_button.addEventListener('click', SaveAdrsBtn)
SetlocationBtn.addEventListener('click', setlococord)

function locationIcon(){
    map_div.classList.add('active')
    L_icon_btn.classList.add('active')
}

function setlococord(){
    if(latcoordinate.value === '' || lngcoordinate.value === ''){
        alert('Error: Please Select Valid Location')
    } else {
        map_div.classList.remove('active')
    location_main_div.classList.add('active')
}
}

function SaveAdrsBtn() {
    let Complete_address = document.getElementById('Complete_address').value 
let userNamedata = document.getElementById('enter-name').value
let mobileno = document.getElementById('mobile').value
    if (userNamedata == "") {
        alert('Error: Enter Your Name.');
    } else if (mobileno == "" || mobileno.length < 10) {
        alert('Error: Enter Your 10 Digit Mobile No.');
    } else if (Complete_address == '') {
        alert('Error: Enter Your Address.');
    } else {
        location_main_div.classList.remove('active');
        L_icon_btn.classList.remove('active');
        console.log(userNamedata, mobileno, Complete_address);
        localStorage.setItem("name:", userNamedata)
        localStorage.setItem("mobile:", mobileno)
        localStorage.setItem("address:", Complete_address)
        document.getElementById('locationName').innerHTML = userNamedata
        document.getElementById('address').innerHTML = Complete_address
        
     }    
}

// ===================================== SUBMIT DATA  ===========================================================

let initialItemTotal = document.getElementById('Item-Total').innerHTML;
let initialDeliveryCharge = document.getElementById('delivery-charges').innerHTML;


const orderButton = document.querySelector(".button");

orderButton.addEventListener("click", () => {
    const itemTotalValue = document.getElementById('Item-Total').innerHTML;
    const deliverychargeValue = document.getElementById('delivery-charges').innerHTML;
    
    // Check if any of the values is "₹0" or if the values remain unchanged
    if (itemTotalValue === "₹0") {
        alert('Error: Cart Was Empty');
    } else if (deliverychargeValue === "₹0" || deliverychargeValue === "0") {
        alert('Error: Location Was Not Selected');
    } else if (itemTotalValue === initialItemTotal && deliverychargeValue === initialDeliveryCharge) {
        alert('Error: Cart and Location Remain Unchanged');
    } else {
        tosheets()
    }
});

// --------------------------------------TO DATABASE-----------------------------------------

    async function tosheets() {
    orderButton.classList.add("active");
    const userEmail = localStorage.getItem('userEmail');
    const cartRows = document.querySelectorAll('.order-card');
    const cartData = [];
    let orderStatus = 'Ordered'
    let deliveryPersonAssign = 'Not Assigned'
    let totalBill = 0;
    let userNamedata = document.getElementById('enter-name').value
    let mobileno = document.getElementById('mobile').value
    let latcoordinate= document.getElementById('latcoordinate').value
    let lngcoordinate = document.getElementById('lngcoordinate').value


    let deliveryFee = parseFloat(document.querySelector('.delivery-charges').innerHTML)

    for (const cartRow of cartRows) {
        const name = cartRow.querySelector('.name').innerText;
        const cost = cartRow.querySelector('.order-price').innerText;
        const quantity = cartRow.querySelector('.order-quantity').value;

        const cartItem = {
            name: name,
            cost: cost.replace('₹', ''),
            quantity: quantity,
        };

        cartData.push(cartItem);

        totalBill += parseFloat(cost.replace('₹', '')) * parseFloat(quantity);
    }

    // Add the delivery fee once
    totalBill += deliveryFee;

    const strng = JSON.stringify({
      cartData,
      totalBill,
      deliveryFee,
      userEmail,
      latcoordinate,
      lngcoordinate,
      userNamedata,
      mobileno,
      orderStatus,
      deliveryPersonAssign,
    });
    console.log(strng);


    setTimeout(() => {
        orderButton.classList.remove("active");
        orderButton.classList.add("inactive");
        orderButton.classList.add("orderSuccessful");
        orderButton.querySelector("span").innerText = "Processing Order";
    }, 2500);

    
    const response = await fetch(scriptUrl, {
        redirect: "follow",
        method: "POST",
        body: strng, // Add userEmail to the payload
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
    });
    const responseData = await response.json();
    console.log(responseData);
    console.log(response);
    if (responseData.status === 'success') {
        orderButton.querySelector("span").innerText = "Order Successful";
        orderSuccess();
        emptyCart();
    }
}

function emptyCart() {
    const cartItems = document.querySelector('.order-wrapper');
    cartItems.innerHTML = ''; // Remove all child elements
    updateCartTotal(); // Update the total bill to show ₹0
}


    let ordersucesstimer;

    function orderSuccess() {
        let c = 2;
        const successful = document.getElementById('orderSuccessful');
        ordersucesstimer = setInterval(() => {
            successful.innerHTML = 'Redirecting Page ' + --c + "s";
            if (c < 0) {
                clearInterval(ordersucesstimer);
                // location.href = "https://www.google.co.in"; 
                successful.innerHTML = 'Please Wait...';
                dashboardElement.style.paddingRight = '10px';
                dashboardOrderElement.classList.remove('active')
            }
        }, 1000);
    }

document.getElementById('help').addEventListener('click', () => {
        const phoneNumber = 'tel:+918919713777 ';
        window.location.href = phoneNumber
})


// ----------------------------------------------- Fetch Order History ------------------------------------------------

  
  var uid = localStorage.getItem('userEmail');
  let orderHistoryUrl = "https://script.google.com/macros/s/AKfycbw6D-R3033PFTAlEtb47PBlkO2At9sfso5ohej-7VqzOA5C-43WdTPEsclQeYKbOSvG6A/exec?uid="+encodeURIComponent(uid);
  async function fetchOrderHistory() {
    try {
      const response = await fetch(orderHistoryUrl);
      const data = await response.json();
      if(data){
        lodainghistory.style.display = 'none'
      }
      return data;
    } catch (error) {
      console.error("Error fetching table data:", error);
      return [];
    }
  }

 
  async function loadOrderHistory() {
    const historyData = await fetchOrderHistory();
  
    class Order {
      constructor() {
        this.history = [];
      }
  
      get history() {
        return this._history;
      }
  
      set history(historyArray) {
        this._history = historyArray.map(historyItem => ({
          date:formatDate(new Date(historyItem[5])),
          orderID: historyItem[0],
          status: historyItem[1],
          items: historyItem.slice(11),
          totalamount: historyItem[10],
          deliveryperson: historyItem[2]
        }));
      }
    }

    function formatDate(date) {
        var day = pad(date.getDate(), 2);
        var month = getMonthName(date.getMonth());
        var year = date.getFullYear();
        var hours = pad(date.getHours(), 2);
        var minutes = pad(date.getMinutes(), 2);
      
        return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;
      }
      
      // Function to get month name
      function getMonthName(monthIndex) {
        var months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[monthIndex];
      }

      function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
          str = '0' + str;
        }
        return str;
      }
  
    class Ui {
        static menu(orderInstance) {
            const frag = document.createDocumentFragment();

            orderInstance.history.forEach(item => {
              const node = document.createElement("div");
              node.className = "history-parent-container";
              node.innerHTML = `
                <hr/>
                <div class="orderiddiv">
                  <p>ORDER ID:</p>
                  <label class="orderID">${item.orderID}</label>
                  <div class="date_time">${item.date}</div>
                </div>
                <div class="history-details" id="history-details">
                <div class="item-details">
                ${Ui.generateOrderItems(item.items)}
                </div>
                <div class="statusdiv">
                <div class="deliveryboy">Delivery Executive:<span>${item.deliveryperson}</span><i class="fa-solid fa-phone mobile-number-delivery"></i></div>
                    <label class="orderStatus">Order Status: <span class="status ${item.status}">${item.status}</span></label>
                    <label class="totalamount">Total: <span class="amount">₹${item.totalamount}</span></label>
                  </div>
                </div>
              `;
              frag.appendChild(node);
              Ui.generatespclprice(item.status, node.querySelector('.status'));
              
                node.addEventListener('click', generateQRCode);
            
            });
            
            document.getElementById('order-history').appendChild(frag);
        }
    
        static generateOrderItems(items) {
            let itemDetailsHTML = '';
      for (let i = 0; i < items.length; i += 3) {
        const itemName = items[i+0];
        const quantity = items[i + 2];
        itemDetailsHTML += `
          <div class="item-details">
            <label class="itemnum">${quantity}<i class="fa-solid fa-times"></i>
            <label class='itemname'>${itemName}</label>
            </label>
          </div>`;
      }
      return itemDetailsHTML;
    }


    static generatespclprice(status , element){
        console.log(element.innerHTML)
            if(status === 'on the way'){
                element.style.background = '#ffd400'
                element.style.color = '#000'
                console.log(element.innerHTML)
            }
    }

          
} 
        const order = new Order();
        order.history = historyData;
        Ui.menu(order);
      }


    function generateQRCode(event) {
        
        const historyContainer = event.currentTarget.closest('.history-parent-container');
        const orderidqr = historyContainer.querySelector('.orderID').innerHTML;
        const deliveryStatus = historyContainer.querySelector('.status').innerHTML;
        const qrcodeMainContainer = document.querySelector('.qr-container')
        const tempqrcontainer = document.querySelector('.qrcode')
        const subMenuWrap = document.querySelector('.sub-menu');

        if (deliveryStatus === 'Arriving') {
            qrcodeMainContainer.classList.add('active')
            orderhistorydiv.classList.remove('active')
            dashboardElement.style.paddingRight = '10px';
            subMenuWrap.classList.remove('active')
            var elementsToRemove = document.getElementsByClassName("history-parent-container");
            Array.from(elementsToRemove).forEach(function(element) {
                element.remove();
            });
            tempqrcontainer.innerHTML = '';
          const qrcode = document.createElement('div');
          qrcode.classList.add('qrcode-container');
          qrcode.id = 'qrcode';
          tempqrcontainer.appendChild(qrcode);
          new QRCode(qrcode, {
            text: orderidqr,
            width: 125,
            height: 125,
          });
        }
      }
   
      
document.querySelector('.qr-close-icon').addEventListener('click', function(){
    const qrcodeMainContainer = document.querySelector('.qr-container')
    qrcodeMainContainer.classList.remove('active')
})


