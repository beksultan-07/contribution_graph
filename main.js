const graphElement = document.querySelector('.graph')
const itemInfo = document.querySelector('.graph-item-info')
const currentDate = new Date()


// get data from db
async function getData (){
    return await fetch('https://dpg.gg/test/calendar.json')
    .then(res => res.json())
}


// create html item with class
function createDay (){
    const graphItemElement = document.createElement('div')
    graphItemElement.classList.add('graph-item')
    return graphItemElement
} 

// create html element, to wrap items
function createWeek (){
    const graphWeekElement = document.createElement('div')
    graphWeekElement.classList.add('graph-week')
    return graphWeekElement
}

// minus day to render days before
function minusDay(){
    const dayToPrev = 1;
    const prevDay = new Date(
        currentDate.setDate(
            currentDate.getDate() - dayToPrev
        ))
        .toISOString()
        .slice(0, 10);
    
    return prevDay
}

// check contribution number to fill color
function checkContribution(num){
    if(num >= 1 && num <= 9){
        return 'contribution-level-1'
    }else if(num >= 10 && num <= 19){
        return 'contribution-level-2'
    }else if(num >= 20 && num <= 29){
        return 'contribution-level-3'
    }else if(num >= 30){
        return 'contribution-level-4'
    }
}

// return week day by num
function getWeekDay(dayNum) {
    switch (dayNum) {
        case 1:
            return 'Понедельник'
        case 2:
            return 'Вторник'
        case 3:
            return 'Среда'
        case 4:
            return 'Четверг'
        case 5:
            return 'Пятница'
        case 6:
            return 'Суббота'                                  
        default:
            return 'Воскресенье'
    }
}

// return month by num
function getMonth(monthNum) {
    switch (monthNum) {
        case 1:
            return 'январь'
        case 2:
            return 'февраль'
        case 3:
            return 'март'
        case 4:
            return 'апрель'
        case 5:
            return 'май'
        case 6:
            return 'июнь'
        case 7:
            return 'июль'
        case 8:
            return 'август'
        case 9:
            return 'сентябрь'
        case 10:
            return 'октябрь'
        case 11:
            return 'ноябрь'                                  
        default:
            return 'декабрь'
    }
}


// more info about item
function renderItemInfo(x, y, date, value){
    // set a date
    const itemDate = new Date(date)
    const dateInfo = `
        ${getWeekDay(itemDate.getDay())}, 
        ${getMonth(itemDate.getMonth())} 
        ${itemDate.getDate()}, 
        ${itemDate.getFullYear()}
    `

    itemInfo.innerHTML = ''

    itemInfo.style.visibility = 'visible' 
    itemInfo.style.opacity = 1

    // determine item position
    itemInfo.style.top = y - itemInfo.offsetHeight - 50 + 'px'
    itemInfo.style.left = x - itemInfo.offsetWidth - 15 + 'px'


    const title = document.createElement('h5')
    title.innerHTML = value + ' contributions'

    const contributions = document.createElement('span')
    contributions.innerHTML = dateInfo
    
    itemInfo.append(title)
    itemInfo.append(contributions)
}


function setMonth() {
    const months = document.querySelectorAll('.month')
    const dateForMonth = new Date()
    months.forEach((element, index) => {
        element.innerHTML = getMonth(dateForMonth.getMonth())
        dateForMonth.setMonth(
            dateForMonth.getMonth() - 1
        )
    });
}


async function render(){
    setMonth()

    const data = await getData()
    const dataValues = Object.values(data)
    const dataKeys = Object.keys(data)

    // all day's of year
    const days = 51 * 7;

    let week = []
    for (let index = 1; index <= days; index++) {
        const item = createDay()
        const prevDay = minusDay()
    
        // check have we info about this day
        if(dataKeys.includes(prevDay)){
            // get info about contributions
            const dayIndex = dataKeys.indexOf(prevDay)
            const contributionNum = dataValues[dayIndex]

            // check and get color
            item.classList.add(checkContribution(contributionNum))
            
            // add data attribute to work subsequent
            item.setAttribute('data-info', JSON.stringify({
                date: dataKeys[dayIndex],
                value: contributionNum
            }))
        }else{
            // if we dont have info about this day
            item.setAttribute('data-info', JSON.stringify({
                date: prevDay,
                value: 0
            }))
        }

        week.push(item)
        // every 7 item push to head element 
        if(index % 7 === 0 ){
            const weekElement = createWeek()
            week.forEach(el => weekElement.append(el))
            graphElement.append(weekElement)
            week = []
        }

        item.addEventListener('mouseenter', function(e){
            // get data and show item info
            const itemInflo1 = JSON.parse(e.target.attributes[1].value)
            renderItemInfo(e.layerX, e.layerY, itemInflo1.date, itemInflo1.value)
            
        })
        
        item.addEventListener('mouseleave', function() {
            // remove item info
            itemInfo.style.visibility = 'hidden' 
            itemInfo.style.opacity = 0
        })

    }
}



render()