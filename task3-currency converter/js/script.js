const dropList = document.querySelectorAll('.drop_list select')
const getButton = document.getElementById('exchange')
const fromCurrency = document.querySelector('.from select')
const toCurrency = document.querySelector('.to select')
const exchangeResult = document.querySelector('.exchange_rate')
const reverseBtn = document.querySelector('.icon');
const API_TOKEN = "82a2e4e4bfa6f59d54a177cd";

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "LBP" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }

    dropList[i].addEventListener('change', e => { 
        loadFlag(e.target);
    })
};

function loadFlag(element) {
    for (code in country_code) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector('img');
            imgTag.src = `https://countryflagsapi.com/png/${country_code[code]}`
        }
    }
}

reverseBtn.addEventListener('click', () => {
    let fromValue = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = fromValue;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
})

getButton.addEventListener('click', (e) => {
    e.preventDefault();
    getExchangeRate();
})

const getExchangeRate = () => {
    const input = document.querySelector('.amount input')
    const inputValue = input.value;
    const errorTxt = document.getElementById('error_txt')

    if (inputValue == '') {
        input.style.borderColor = "red"
        errorTxt.innerText = "Please enter a correct value"
        console.error("Value is not acceptable, it's either null or less than 0 or bigger than 2,000,000,000")
        return
    }
    else if (inputValue < 1) {
        input.style.borderColor = "red"
        errorTxt.innerText = "Value must be greater than or equal to 1"
        console.error("Value is not acceptable, it's either null or less than 0 or bigger than 2,000,000,000")
        return
    }
    else if (inputValue <= 2000000000){
        exchangeResult.innerHTML = `
        <div class="loading">
        <img class="money_loading" src="https://c.tenor.com/yQPfHp6AmGgAAAAi/money-with-wings-joypixels.gif" />
        <p>Getting exchange rate...</p>
        </div>
        `
        setTimeout(() => {
            let url = `https://v6.exchangerate-api.com/v6/${API_TOKEN}/latest/${fromCurrency.value}`
            fetch(url).then(res => res.json()).then(res => {
                let exchangeRate = res.conversion_rates[toCurrency.value]
                let totalExchangeRate = (inputValue * exchangeRate).toFixed(2)
                let finalResult = `
                <p class="exchange_result">${numeral(inputValue).format('0,0')} ${fromCurrency.value} = ${numeral(totalExchangeRate).format('0,0.00')} ${toCurrency.value}</p> 
                `
                exchangeResult.innerHTML = finalResult;
                input.style.borderColor = "#11d358"
                errorTxt.innerText = null
            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err + ".Please refresh or try again later"
                })
                exchangeResult.innerHTML = `<div class="error_text2"><img class="error_img" src="http://pa1.narvii.com/6884/893d63465f58084348ffb67d55ca80a248439c68r1-291-270_00.gif"><p>Something went wrong...</p></div>`
            })
        }, 1200) 
    } else if (inputValue > 2000000000) {
        input.style.borderColor = "red"
        errorTxt.innerText = "Value too big"
        console.error("Value is not acceptable, it's either null or less than 0 or bigger than 2,000,000,000")
        return
    }
}

