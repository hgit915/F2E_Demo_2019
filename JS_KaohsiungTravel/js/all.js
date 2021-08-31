$( document ).ready(function() {
  let data;  
  let zone_length;
  let zone_array = [];
    $.ajax({
        url: 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',
        type: 'GET',
        async:true,
        dataType : 'json',
        success: function(res){ 

            data = res.result
            zone_length = data.records.length;
            //將所有data內的行政區，存取到空陣列內
            for (let i = 0; i < zone_length; i++) {
                zone_array.push(data.records[i].Zone);
            }

            //透過new Set 移除重複的值，並使用Array.from轉成陣列的格式
            //不能只寫new Set, 需要轉換成陣列格式=>Array.from
            let zone = Array.from(new Set(zone_array));

            //利用迴圈，將zone的值,呈現至HTML的下拉選單
            for (let i = 0; i < zone.length; i++) {

                //建立一個元素<option>
                let str = document.createElement("option");
                // 設定<option> 屬性value的值
                str.setAttribute("value", zone[i]);
                // 設定<option> 屬性data-num,紀錄被點選次數,統計熱門地區
                str.setAttribute("data-num", 0);
                // 設定<option> 要顯示的字
                str.textContent = zone[i];
                //將此DOM 回掛.district之下
                document.querySelector('.district').appendChild(str);
            }
        },
         
    });

    //點選下拉選單此元素
    let selected_zone = document.querySelector('.district')
    //監聽:該元素發生change，則執行updateList function
    selected_zone.addEventListener('change', updateList, false);


    //渲染熱門行政區畫面 
    //若localStorage是空的,則不渲染畫面
    if (JSON.parse(localStorage.getItem('zone')) != null) {
        show_popular_zone()
    }

    //更新資料
    function updateList(e) {
        //紀錄熱門地區至localStorage
        popular_zone(e);

        //先清空先前撈取的畫面資料
        document.querySelector('ul').innerHTML = ' ';
        //將 h2 標題做變換
        document.querySelector('.zone').textContent = e.target.value;

        //顯示該地區景點
        let data_length = data.records.length;

        //計算景點數
        let count_num = 0;
        for (let i = 0; i < data_length; i++) {
            if (e.target.value == data.records[i].Zone) {
                //計算總共幾個景點
                count_num++;

                //創建一個<li>元素
                let str_li = document.createElement('li');
                str_li.setAttribute('data-page', Math.ceil(count_num / 4));

                //創建一個<div>元素
                let str_div = document.createElement('div');

                // 將innerHtml的內容(圖片+景點名稱)加進 div內
                //: <div><img ...><h3>...</h3></div> 
                str_div.innerHTML = '<img src="' + data.records[i].Picture1 + '" alt=""><div class="title clearfix"><span class="title_name">' + data.records[i].Name + '</span><span class="zone_name">' + data.records[i].Zone + '</span></div>';

                //給予div屬性: <div class='place' ></div>
                str_div.setAttribute('class', 'place');

                //li掛在ul之下,div掛在li之下
                document.querySelector('ul').appendChild(str_li).appendChild(str_div);

                //開放時間
                let str_open = document.createElement('p');
                str_open.innerHTML = '<img class="icon" src="img/icons_clock.png" alt="">' + data.records[i].Opentime;

                //地址
                let str_Add = document.createElement('p');
                str_Add.innerHTML = '<img  class="icon" src="img/icons_pin.png" alt="">' + data.records[i].Add;
                // 
                //電話
                let str_Tel = document.createElement('p');
                str_Tel.innerHTML = '<img  class="icon" src="img/icons_phone.png" alt="">' + data.records[i].Tel;

                //票價
                let str_Ticketinfo = document.createElement('p');
                str_Ticketinfo.innerHTML = '<img class="icon" class="ticket_icon" src="img/icons_tag.png" alt="">' + data.records[i].Ticketinfo;

                /*Q:appendChild 問題請教 */
                document.querySelector('ul').appendChild(str_li).appendChild(str_open);
                document.querySelector('ul').appendChild(str_li).appendChild(str_Add);
                document.querySelector('ul').appendChild(str_li).appendChild(str_Tel);
                document.querySelector('ul').appendChild(str_li).appendChild(str_Ticketinfo);
            }
        }
        console.log('共' + count_num + '個景點');

        //每頁呈現 4個景點即換下一頁
        //計算總頁數
        let total_page = Math.ceil(count_num / 4); //Math.ceil 取大
        console.log(total_page);
        pre_show_page();

        //顯示頁數
        document.querySelector('.page').innerHTML = '';
        for (let page_count = 1; page_count <= total_page; page_count++) {
            let page_a = document.createElement('a');
            page_a.setAttribute('id', 'page' + page_count);
            page_a.setAttribute('data-page', page_count);
            page_a.setAttribute('href', '#');
            page_a.textContent = page_count;
            document.querySelector('.page').appendChild(page_a);
        }

        //一開始只秀第一頁的景點
        show_page('1');
    }

    //先渲染page架構
    // pre_show_page()

    function pre_show_page() {
        // 先 clear page
        $(".pre , .next , .page ").remove();

        // 重新 render
        let pre_page_str = document.createElement('a');
        pre_page_str.setAttribute('href', '#');
        pre_page_str.setAttribute('class', 'pre');
        document.querySelector('.page_show').appendChild(pre_page_str);

        //create 頁碼的element
        let page_class = document.createElement('div');
        page_class.setAttribute('class', 'page');
        document.querySelector('.page_show').appendChild(page_class);

        let next_page_str = document.createElement('a');
        next_page_str.setAttribute('href', '#');
        next_page_str.setAttribute('class', 'next');
        document.querySelector('.page_show').appendChild(next_page_str);
        
        // pre and next
        document.querySelector('.pre').textContent = '<< pre ';
        document.querySelector('.next').textContent = 'next >>';

        //點選page,顯示畫面
        let click_page = document.querySelector('.page');
        click_page.addEventListener('click', function (e) {
            if (e.target.nodeName == 'A') {
                e.preventDefault();
                show_page(e.target.dataset.page);
            }
        }, false)

        // bind page event
        //pre 前一頁
        let click_pre = document.querySelector('.pre');
        click_pre.addEventListener('click', function (e) {
            e.preventDefault();

            //先抓取當前頁的Page
            let history_state_page = history.state.page;

            //判斷是否已經是第一頁
            if (history_state_page == '1') {
                alert('已經第一頁了', history_state_page)
            } else {

                let pre_page = String(parseInt(history_state_page) - 1);
                show_page(pre_page);
            }
        })

        //next後一頁
        let click_next = document.querySelector('.next');
        click_next.addEventListener('click', function (e) {
            e.preventDefault();
            //抓取紀錄於history的目前頁數
            let history_state_page = history.state.page;

            //取得最後一個元素的dataset
            let last_child = document.querySelector('li:nth-last-child(1)').dataset.page;
            console.log('last' + last_child);
            if (history_state_page == last_child) {
                alert('已經最後一頁', history_state_page)
            } else {
                let pre_page = String(parseInt(history_state_page) + 1);
                show_page(pre_page);
            }
        })
    }   



    //只顯示當前頁的景點
    function show_page(page) {

        let show_page_li = document.querySelectorAll('li');

        let page_length = document.querySelectorAll('li').length;

        for (let k = 0; k < page_length; k++) {

            if (page !== show_page_li[k].dataset.page) {
                show_page_li[k].style.display = 'none';
            } else {
                show_page_li[k].style.display = 'block';
            }
        }


        //url 紀錄 記錄當前頁的page
        let state = {
            page: page
        };
        window.history.pushState(state, 'test', 'page#' + page);
        console.log('history.state' + JSON.stringify(history.state));
    }


    //紀錄熱門地區
    function popular_zone(e) {

        //判斷localStorage是否已有值存在,若無則空陣列
        let local_array = JSON.parse(localStorage.getItem('zone')) || [];

        //撈取選中項的index
        let index = e.target.selectedIndex;

        //取得local_array陣列長度
        let array_length = local_array.length;

        //確認localStorage是否有紀錄
        let check = false;
        let i = 0;
        for (i; i < array_length; i++) {
            //選中的index比對localStorage內的Index是否，確認是否已存在
            if (index === local_array[i].index) {
                check = true;
                break;
            } else {
                check = false;
            }
        }

        if (check) {
            //若已有紀錄則num++
            local_array[i].num++;
        } else {
            //若無紀錄直接加入object
            let obj_data = {
                'index': index,
                'zone': e.target.value,
                'num': 1
            }
            //obj_data 存入local_array陣列內
            local_array.push(obj_data);
        }

        //最後將最新的local_array回存至localStorage內
        localStorage.setItem('zone', JSON.stringify(local_array));
        show_popular_zone();
    }



    //顯示熱門地區
    function show_popular_zone() {

        //先清空先前撈取的畫面資料
        document.querySelector('.popular').innerHTML = ' ';

        //撈取localStorage的值
        let get_data = JSON.parse(localStorage.getItem('zone'));

        //排序
        get_data.sort(function (a, b) {
            return b.num - a.num
        })
        //比大小 選出前4次數最多的(若有同次數,則選擇陣列最前面的show出)
        console.log(get_data);

        //確保熱門地區域數維持在1-4個
        let get_data_length = JSON.parse(localStorage.getItem('zone')).length;
        if (get_data_length > 5) {
            get_data_length = 4;
        }

        //0個也不會show畫面
        for (let j = 0; j < get_data_length; j++) {
            console.log("第" + (j + 1) + "熱門地區是: " + get_data[j].zone + ",共點擊了" + get_data[j].num + "次。");

            //顯示於html畫面
            let str_span = document.createElement('span');
            str_span.textContent = get_data[j].zone;
            str_span.setAttribute('class', 'popular-0' + j);

            document.querySelector('.popular').appendChild(str_span);
        }
        console.log(get_data);

    }


    //top
    $('.top').click(function (e) {
        e.preventDefault();

        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });
});