/* ================================== VARIABLES ==================================== */
var current_date = new Date();
var GlobalDay;
var current_nameofday = current_date.getDay();
var current_day = current_date.getDate();
var current_month = current_date.getMonth();
var current_year = current_date.getFullYear();
var months = Array('Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
    'Октябрь', 'Ноябрь', 'Декабрь');
var days_in_month = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var monthsPOD = Array('Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября',
    'Октября', 'Ноября', 'Декабря');
var currentEvent;
var hasEvent;
var hasTitle;
var hasNames;
var hasDescription;
var massForSearch;
var re = /\s*,\s*/;
var re1 = /\s* \s*/;
var reALL = /\s*[ ,.]\s*/;
var monthValue = Array(
    Array('1', 'январь', 'января', 'янв', 'january', 'jan'),
    Array('2', 'февраль', 'февраля', 'фев', 'february', 'feb'),
    Array('3', 'март', 'марта', 'мар', 'march', 'mar'),
    Array('4', 'апрель', 'апреля', 'апр', 'april', 'apr'),
    Array('5', 'май', 'мая', 'may'),
    Array('6', 'июнь', 'июня', 'июн', 'june', 'jun'),
    Array('7', 'июль', 'июля', 'июл', 'july', 'jul'),
    Array('8', 'август', 'августа', 'авг', 'august', 'aug'),
    Array('9', 'сентябрь', 'сентября', 'сен', 'september', 'sep'),
    Array('10', 'октябрь', 'октября', 'окт', 'october', 'oct'),
    Array('11', 'ноябрь', 'ноября', 'ноя', 'november', 'nov'),
    Array('12', 'декабрь', 'декабря', 'дек', 'december', 'dec')
);

function Event(key, event, names, description) {
    this.date = key.split(' ')[0];
    this.month = key.split(' ')[1];
    this.year = key.split(' ')[2];
    this.event = event;
    this.names = names;
    this.description = description;
}
var flagpush = false;
var flagaddbigevent = false;
var flagsearch = false;
/* ================================== JQUERY =======================================*/
/*
 * Update
 */
$('#updatebutton').click(Update);
/*
 * ClickOnArrow
 */
$('.leftarrowbutton').on('click', function () {
    ClickOnArrow('prev');
});
$('.rightarrowbutton').on('click', function () {
    ClickOnArrow('next');
});
/*
 * Return to current DATE
 */
$('.greybutton').click(GetToday);
/*
 * All for fast events
 */
$('#buttonadd').click(GetFormForFastEvent);
$('.formadd_cross').click(CrossFastEvent);
$('.formadd_button').click(AddFastEvent);
/*
 * All for big events
 */
$('.day').click(function () {
    GetFormForBigEvent(this);
});
$('.formaddtask_cross').click(CrossBigEvent);
$('.formaddtask_button_add').click(AddBigEvent);
$('.formaddtask_button_delete').click(DeleteBigEvent);
/*
 * ForSearch
 */
$('[name=search]').keyup(StartSearch);
$('.search').on('click', '.search_block', function () {
    $('.mainsearch').css('display', 'none');
    flagsearch = false;
    var elem = getEvent(GetDate($(this).children('.search_block_text-date').text()));
    console.log($(this).children('.search_block_text-date').text());
    current_month = parseInt(elem.month);
    current_year = parseInt(elem.year);
    $('.search').empty();
    FillBlocks();
});
$('.page').click(function () {
    $('[name=search')[0].value = '';
});
/* ================================== FUNCTIONS ==================================== */

function FillBlocks() {
    $('.currentday').removeClass('currentday');
    DeleteAllEventsInBlock();
    days_in_month[1] = current_year % 4 == 0 ? 29 : 28;
    $('.databox').text(months[current_month] + ' ' + current_year);
    var count = 0;
    var days_numbers = [];
    var a = parseInt((14 - current_month + 1) / 12);
    var y = current_year - a;
    var m = current_month + 1 + 12 * a - 2;
    var first_date_in_month = (7000 + (1 + y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) +
        parseInt(31 * m / 12))) % 7;
    if (first_date_in_month == 0) {
        first_date_in_month = 7;
    }
    if ((first_date_in_month == 6 && days_in_month[current_month] == 31) || (first_date_in_month == 7 && days_in_month[current_month] >= 30)) {
        $('ul li.day').each(function (index) {
            if (index > 27 && index <= 34) {
                $(this).removeClass('lastweek');
            }
            if (index >= 35 && index < 42) {
                $(this).removeClass('floatweek');
            }
        });
    } else {
        $('ul li.day').each(function (index) {
            if (index > 27 && index <= 34) {
                $(this).addClass('lastweek');
            }
            if (index >= 35 && index < 42) {
                $(this).addClass('floatweek');
            }
        });
    }
    if (first_date_in_month != 1) {
        var days_in_prev_month;
        var first_day_in_week;
        days_in_prev_month = current_month == 0 ? days_in_month[11] : days_in_month[current_month - 1];
        first_day_in_week = days_in_prev_month - first_date_in_month + 2;
        for (var i = 0; i < first_date_in_month - 1; i++) {
            days_numbers.push(first_day_in_week + i);
            count++;
        }
    }
    for (var i = 1; i <= days_in_month[current_month]; i++) {
        days_numbers.push(i);
        count++;
    }
    var newmonth = 1;
    while (count < 42) {
        days_numbers.push(newmonth);
        newmonth++;
        count++;
    }
    var today = first_date_in_month + current_day - 2;
    $('ul li.day').each(function (index) {
        $(this).removeAttr('id');
        $(this).children('.insidetext').text(days_numbers[index]);
        if (index < first_date_in_month - 1) {
            //prevMonth
            $(this).attr('id', 'prevMonth');
        } else if (index < first_date_in_month + days_in_month[current_month] - 1) {
            //currentMonth
            if (index == today && current_date.getFullYear() == current_year && current_date.getMonth() == current_month) {
                $(this).addClass('currentday');
            }
            $(this).attr('id', 'currentMonth');
            var buf = index - first_date_in_month + 2;
            var elem = getEvent(GetCurrentKey(buf));
            if (elem != null) {
                $(this).addClass('daywithtask');
                elem.event = elem.event.charAt(0).toUpperCase() + elem.event.substring(1);
                $(this).children('.insidetext').after('<br/><span class="titletask">' +
                    elem.event +
                    '</span><br><span class="tasktext">' +
                    elem.names +
                    '</span>'
                );
            }
        } else {
            //nextMonth
            $(this).attr('id', 'nextMonth');
        }
    });
}

function getEvent(key) {
    var bufEvent = localStorage.getItem(key);
    if (bufEvent != null) {
        var event = bufEvent.split('~');
        return new Event(key, event[3], event[4], event[5]);
    } else {
        return null;
    }
}

function setEvent(even, remove) {
    if (remove || getEvent(GetKey(even)) == null) {
        localStorage.setItem(GetKey(even),
            even.date + '~' + even.month + '~' + even.year + '~' +
            even.event + '~' + even.names + '~' + even.description + ''
        );
        return true;
    } else {
        return false;
    }
}

function removeEvent(key) {
    return localStorage.removeItem(key);
}

function ClickOnArrow(elem) {
    if (elem == 'prev') {
        if (current_month == 0) {
            if (current_year > 1950) {
                current_year -= 1;
                current_month = 11;
            }
        } else {
            current_month -= 1;
        }
    } else if (elem == 'next') {
        if (current_month == 11) {
            if (current_year < 2049) {
                current_year += 1;
                current_month = 0;
            }
        } else {
            current_month += 1;
        }
    }
    FillBlocks();
}

function GetDate(str) {
    if (str == '') return null;
    var re2 = /\s*\.\s*/;
    var re3 = /\s*-\s*/;
    var countOfDays = current_year % 4 == 0 && current_month == 1 ? 29 : days_in_month[current_month];
    var listOfDate = str.split(re);
    if (listOfDate.length < 2 || listOfDate.length > 3) {
        listOfDate = str.split(re3);
        if (listOfDate.length < 2 || listOfDate.length > 3) {
            listOfDate = str.split(re2);
            if (listOfDate.length < 2 || listOfDate.length > 3) {
                listOfDate = str.split(re1)
                if (listOfDate[0] == '') {
                    for (var i = 0; i < listOfDate.length - 1; i++)
                        listOfDate[i] = listOfDate[i + 1];
                    listOfDate.length--;
                }
                if (listOfDate[listOfDate.length - 1] == '') listOfDate.pop();
                if (listOfDate.length < 2 || listOfDate.length > 3) {
                    if (listOfDate.length == 1 && listOfDate[0] > 0 && listOfDate[0] <= countOfDays)
                        return '' + listOfDate[0] + ' ' + current_month + ' ' + current_year + '';
                    else return null;
                }
            }
        }
    }
    if (listOfDate[0] < 1) return null;
    listOfDate[1] = listOfDate[1].toLowerCase();
    if (listOfDate[1].charAt(0) == '0') listOfDate[1] = listOfDate[1].substring(1);
    var i = 0;
    for (i; i < monthValue.length; i++) {
        var j = 0;
        for (j; j < monthValue[i].length; j++)
            if (monthValue[i][j] == listOfDate[1]) break;
        if (j != monthValue[i].length) {
            listOfDate[1] = i + '';
            break;
        }
    }
    if (i == monthValue.length) return null;
    if (listOfDate[0] > days_in_month[listOfDate[1]]) return null;
    if (listOfDate.length == 2) return listOfDate[0] + ' ' + listOfDate[1] + ' ' + current_year;
    if (!parseInt(listOfDate[2])) return null;
    var year = parseInt(listOfDate[2]);
    if (year >= 0 && year < 100) {
        if (year < 50) {
            var str = '20';
            if (year < 10) str += '0';
            return listOfDate[0] + ' ' + listOfDate[1] + ' ' + str + year;
        } else return listOfDate[0] + ' ' + listOfDate[1] + ' 19' + year;
    }
    if (year >= 1950 && year < 2050) return listOfDate[0] + ' ' + listOfDate[1] + ' ' + year;
    return null;
}

function GetKey(even) {
    return even.date + ' ' + even.month + ' ' + even.year;
}

function ItemSearch(str, months) {
    this.str = Array();
    for (var i = 0; i < str.length; i++) {
        if (str[i] != '') this.str.push(str[i]);
    }
    this.count = 0;
    this.months = months;
}

function GetToday() {
    current_year = current_date.getFullYear();
    current_month = current_date.getMonth();
    FillBlocks();
}

function GetCurrentKey(day) {
    return day + ' ' + current_month + ' ' + current_year;
}

function GetFormForFastEvent() {
    $("[name=newtask]")[0].value = "";
    if (flagpush == false) {
        $(this).addClass('buttonpush');
        $(this).children().addClass('buttonpush_text');
        $('.formadd').css('display', 'inline-block');
        flagpush = true;
    } else {
        CrossFastEvent();
    }
}

function CrossFastEvent() {
    $('.buttonpush').removeClass('buttonpush');
    $('.buttonpush_text').removeClass('buttonpush_text');
    $('.formadd').css('display', 'none');
    $("[name=newtask]")[0].value = "";
    flagpush = false
}

function DeleteAllEventsInBlock() {
    $('ul li.day').each(function (index) {
        if ($(this).removeClass('daywithtask')) {
            $(this).removeClass('daywithtask');
            $(this).children('.insidetext').nextAll().remove();
        }
    });
}

function AddFastEvent() {
    var description, date, event = '';
    var newevent = $("[name=newtask]")[0].value;
    var mas_parse = newevent.split(re);
    var date = GetDate(mas_parse[0]);
    if (mas_parse.length == 1) return;
    if (date == null) {
        alert('Date is not valid');
        return;
    }
    description = mas_parse[1];
    for (var i = 2; i < mas_parse.length; i++) event += mas_parse[i];
    if (description == '' && event == '') return;
    if (!setEvent(new Event(date, event, '', description), false)) alert('You have event in this day');
    else {
        current_month = parseInt(date.split(' ')[1]);
        current_year = parseInt(date.split(' ')[2]);
        console.log(current_month);
        FillBlocks();
        CrossFastEvent();
    }
}

function GetFormForBigEvent(thiss) {
    if ($(thiss).attr('id') == 'prevMonth') {
        ClickOnArrow('prev');
        CrossFastEvent();
        CrossBigEvent();
    } else if ($(thiss).attr('id') == 'nextMonth') {
        ClickOnArrow('next');
        CrossFastEvent();
        CrossBigEvent();
    } else if ($(thiss).attr('id') == 'currentMonth') {
        DisplayBigForm(thiss);
    } else {
        alert('No ID');
    }
}

function DisplayBigForm(thiss) {
    //if ( !$(thiss).hasClass('daywithtask') ) {
    if (flagaddbigevent == false) {
        var pos = $(thiss).position();
        var page_width = $('.page').width();
        var page_heigth = $('.page').height();
        if (pos.top + $('.formaddtask').height() + $(thiss).height() - 15 > page_heigth) {
            pos.top = pos.top - $('.formaddtask').height() + $(thiss).height();
            $('.formaddtask').children('#b').css('top', pos.top - 2 + 'px');
            $('.formaddtask').children('#a').css('top', pos.top - 1 + 'px');
        } else {
            pos.top -= 15;
            $('.formaddtask').children('#b').css('top', 22 + 'px');
            $('.formaddtask').children('#a').css('top', 23 + 'px');
        }
        if (pos.left + $('.formaddtask').width() + $(thiss).width() + 100 > page_width) {
            pos.left = pos.left - $('.formaddtask').width() - 12;
            $('.formaddtask').children('.formaddtaskbefore').addClass('formaddtaskbefore2');
            $('.formaddtask').children('.formaddtaskafter').addClass('formaddtaskafter2');
            $('.formaddtask').children('.formaddtaskbefore2').removeClass('formaddtaskbefore');
            $('.formaddtask').children('.formaddtaskafter2').removeClass('formaddtaskafter');
        } else {
            pos.left = pos.left + $(thiss).width() + 12;
            $('.formaddtask').children('.formaddtaskbefore2').addClass('formaddtaskbefore');
            $('.formaddtask').children('.formaddtaskafter2').addClass('formaddtaskafter');
            $('.formaddtask').children('.formaddtaskbefore').removeClass('formaddtaskbefore2');
            $('.formaddtask').children('.formaddtaskafter').removeClass('formaddtaskafter2');
        }
        $('.formaddtask').css('top', pos.top + 'px');
        $('.formaddtask').css('left', pos.left + 'px');
        $(thiss).addClass('dayaddtask');
        $('.formaddtask').css('display', 'inline-block');
        FillForm(thiss);
        flagaddbigevent = true;
    } else {
        $('.formaddtask').css('display', 'none');
        $('.dayaddtask').removeClass('dayaddtask');
        flagaddbigevent = false;
    }
}

function FillForm(thiss) {
    GlobalDay = $(thiss).children('.insidetext').text();
    currentEvent = getEvent(GetCurrentKey(GlobalDay));
    hasEvent = currentEvent != null;
    hasTitle = hasEvent && currentEvent.event != '';
    hasNames = hasEvent && currentEvent.names != '';
    hasDescription = hasEvent && currentEvent.description != '';
    if (hasTitle) {
        $('.formaddtask_task_task').css('display', 'inline-block');
        $('.formaddtask_task_task').on('click', function () {
            hasTitle = false;
            $('.formaddtask_task_task').css('display', 'none');
            $('[name=task]').css('display', 'inline-block');
            $('[name=task]')[0].value = $('.formaddtask_task_task').text();
        });
        $('[name=task]').css('display', 'none');
        $('.formaddtask_task_task').text(currentEvent.event.charAt(0).toUpperCase() + currentEvent.event.substring(1));
    } else {
        $('.formaddtask_task_task').css('display', 'none');
        $('[name=task]').css('display', 'inline-block');
    }
    if (hasEvent) {
        $('.formaddtask_date_date').css('display', 'inline-block');
        $('.formaddtask_date_date').on('click', function () {
            removeEvent(GetCurrentKey(GlobalDay));
            $('.formaddtask_date_date').css('display', 'none');
            $('[name=date]').css('display', 'inline-block');
            $('[name=date]')[0].value = $('.formaddtask_date_date').text();
        });
        $('[name=date]').css('display', 'none');
        $('.formaddtask_date_date').text(currentEvent.date + ' ' + monthsPOD[currentEvent.month]);
    } else {
        $('.formaddtask_date_date').css('display', 'none');
        $('[name=date]').css('display', 'inline-block');
    }
    if (hasNames) {
        $('.formaddtask_names_names').css('display', 'inline-block');
        $('.formaddtask_names_names').on('click', function () {
            hasNames = false;
            $('.formaddtask_names_names').css('display', 'none');
            $('[name=names]').css('display', 'inline-block');
            $('[name=names]')[0].value = $('.formaddtask_names_names_value').text();
        });
        $('[name=names]').css('display', 'none');
        $('.formaddtask_names_names_value').text(currentEvent.names);
    } else {
        $('.formaddtask_names_names').css('display', 'none');
        $('[name=names]').css('display', 'inline-block');
    }
    if (hasDescription) {
        $('.formaddtask_description_description').css('display', 'inline-block');
        $('.formaddtask_description_description').on('click', function () {
            hasDescription = false;
            $('.formaddtask_description_description').css('display', 'none');
            $('[name=description]').css('display', 'inline-block');
            $('[name=description]')[0].value = $('.formaddtask_description_description').text();
        });
        $('[name=description]').css('display', 'none');
        $('.formaddtask_description_description').text(currentEvent.description);
    } else {
        $('.formaddtask_description_description').css('display', 'none');
        $('[name=description]').css('display', 'inline-block');
    }
}

function AddBigEvent() {
    var date = $('[name=date]')[0].value != '' ? GetDate($('[name=date]')[0].value) : GetCurrentKey(GlobalDay);
    if (date == null) {
        alert('Date is not valid');
        CrossBigEvent();
        return;
    }
    var names = $('[name=names]')[0].value;
    if (hasNames) names = currentEvent.names;
    var description = $('[name=description]')[0].value;
    if (hasDescription) description = currentEvent.description;
    var event = $('[name=task]')[0].value;
    if (hasTitle) event = currentEvent.event;
    if (event != '' || names != '' || description != '') {
        if (GlobalDay == date.split(' ')[0] && date.split(' ')[1] == current_month && date.split(' ')[2] == current_year) removeEvent(GetCurrentKey(GlobalDay));
        if (!setEvent(new Event(date, event, names, description), false)) alert('You have event in this day');
        else {
            current_month = parseInt(date.split(' ')[1]);
            current_year = parseInt(date.split(' ')[2]);
            FillBlocks();
            CrossBigEvent();
        }
    } else {
        CrossBigEvent();
    }
}

function DeleteBigEvent() {
    removeEvent(GetCurrentKey(GlobalDay));
    FillBlocks();
    CrossBigEvent();
}

function CrossBigEvent() {
    $('.dayaddtask').removeClass('dayaddtask');
    $('.formaddtask').css('display', 'none');
    flagaddbigevent = false;
    $("[name=task]")[0].value = "";
    $("[name=date]")[0].value = "";
    $("[name=names]")[0].value = "";
    $("[name=description]")[0].value = "";
}

function SearchAction(source) {
    massForSearch = new Array();
    if (source == '') return;
    for (var i = 0; i < localStorage.length; i++) {
        var even = getEvent(localStorage.key(i))
        if (even.year > current_date.getFullYear() || (even.year == current_date.getFullYear() && even.month > current_date.getMonth()) || (even.year ==
            current_date.getFullYear() && even.month == current_date.getMonth() && even.date >= current_date.getDate())) {
            var str = even.date + ',' + even.year + ',' + even.names.split(reALL) + ',' + even.event.split(reALL);
            massForSearch.push(new ItemSearch(str.split(','), monthValue[even.month]));
        }
    }
    return SortStorage(source);
}

function cmpString(source, destination, endOfInput) {
    if (source == undefined || destination == undefined) return false;
    if (source.length == 0 || destination.length == 0) return false;
    if (source.length > destination.length) return false;
    if (endOfInput)
        destination = destination.substring(0, source.length);
    if (source.toLowerCase() == destination.toLowerCase()) return true;
    return false;
}

function SortStorage(source) {
    var sourceCount = source.split(reALL);
    for (var c = 0; c < sourceCount.length; c++) {
        for (var i = 0; i < massForSearch.length; i++) {
            var buf = sourceCount.length == c + 1;
            var massOfStrings = massForSearch[i].str;
            for (var j = 0; j < massOfStrings.length; j++) {
                if (cmpString(sourceCount[c], massOfStrings[j], buf)) {
                    massForSearch[i].count++;
                }
            }
            for (var j = 0; j < massForSearch[i].months.length; j++) {
                if (cmpString(sourceCount[c], (parseInt(massForSearch[i].months[j]) - 1).toString(), buf)) {
                    massForSearch[i].count++;
                    break;
                }
            }
        }
    }
    massForSearch.sort(function (a, b) {
        return -a.count + b.count
    });
    for (var i = 0; i < massForSearch.length; i++)
        if (massForSearch[i].count == 0) {
            massForSearch.length = i;
            break;
        }
    massForSearch.sort(function (a, b) {
        if (parseInt(a.str[1]) == parseInt(b.str[1]))
            if (parseInt(a.months[0]) == parseInt(b.months[0]))
                return parseInt(a.str[0]) - parseInt(b.str[0]);
            else return parseInt(a.months[0]) - parseInt(b.months[0]);
            else return parseInt(a.str[1]) - parseInt(b.str[1]);
    });
    var resultMass = Array();
    for (var i = 0; i < massForSearch.length; i++) {
        resultMass.push(massForSearch[i].str[0] + ' ' +
            (parseInt(massForSearch[i].months[0]) - 1) + ' ' +
            massForSearch[i].str[1]
        );
    }
    return resultMass;
}

function StartSearch() {
    var str = $('[name=search]')[0].value;
    //console.log();
    var keys = SearchAction(str);
    if (keys != undefined && keys.length != 0) {
        GetFormForSearch(keys);
    } else {
        $('.search').empty();
        $('.mainsearch').css('display', 'none');
        flagsearch = false;
    }
}

function GetFormForSearch(keys) {
    $('.search').empty();
    for (var i = 0; i < keys.length; i++) {
        var elem = getEvent(keys[i]);
        console.log(keys[i]);
        var bufYear = current_date.getFullYear() == elem.year ? '' : ' ' + elem.year;
        $('.search').append('<div class="search_block"><div class="search_block_text-title">' + elem.event + '</div><div class="search_block_text-date">' +
            elem.date + ' ' + monthsPOD[elem.month] + bufYear + '</div></div><div class="line"></div>');
    }
    $('.mainsearch').css('display', 'inline-block');
    flagsearch = true;
}

function Update() {
    localStorage.clear();
    location.reload();
}
/* ================================= CALL FUNCTIONS ================================ */
FillBlocks();