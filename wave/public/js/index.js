var login = {};
var index = {};

var DateCharts = function (iswho, id, startdate, enddate) {
    require.config({
        paths: {
            echarts: '../js'
        }
    });
    var id;
    /** loading */
    $('.loading-area').fadeIn();
    /**
     * [options: style options for echart]
     * @type {Object}
     */
    var options = {
        color: ['#cb9afe', '#fccd95', '#9acdff', '#43ca81', '#a10000',"#ff99cc"],
        title: {
            x: '44',
            y: 'bottom',
            textStyle: {
                fontSize: '16',
                color: '#666',
                align: 'left',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                fontWeight: 'normal'
            }
        },
        toolTip: {
            format: '{a} <br/>{b}',
            textStyle: {
                fontSize: '14',
                color: '#fff',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                align: 'left',
                fontWeight: 'normal'
            }
        },
        legend: {
            x: 161,
            y: 31,
            itemGap: 16,
            textStyle: {
                color:'#666',
                fontSize: '16',
                fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
                align: 'left',
                fontWeight: 'normal'
            }
        },
        series: {
            center: [77, 77]
        }
    }

    if(iswho == 1){//开发者
        getUsersTestData("76%", "55%", 77, 106, 182, 161, 190, 266, 44, 75, 149, 'bottom');
        getProviderData("76%", "55%", 77, 106, 182, 161, 190, 266, 44, 75, 149, 'bottom');
    }else if(iswho == 2){//广告商
        getUsersTestData("59%", "42%", 57, 76, 76, 129, 148, 148, 25, 43, 44, 150);
        getProviderData("59%", "42%", 57, 76, 76, 129, 148, 148, 25, 43, 44, 150);
    }

    //请求测试数据
    function getUsersTestData(bigRadius, smallRadius, seriesX1, seriesX2, seriesX3, legendX1, legendX2, legendX3, titleX1, titleX2, titleX3, titleY){
        var chipNo = $(".list-children>.list-selected").attr("data-chipno");
        var id = chipNo ? chipNo%6 : null;
        $.ajax({
            url: BASEURL + 'admin/api/getUsersPortraitReport',
            type: 'POST',
            data: {
                id: id
            },
            dataType: 'json',
        })
        .done(function(data) {
            console.log(data);
            if(data.success){
                if (data.sex.length > 0) {
                    var sexArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.sex.length; i++){
                        var zan = {};
                        zan['name'] = data.sex[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        sexArray.push(zan);
                    }
                    $('#sexChart').show();
                    $('#sexChart').css({
                        'margin-top':'0'
                    });
                    $('#sexChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var sexChart = ec.init(document.getElementById('sexChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '性别分析',
                                    x: titleX1,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX1,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: sexArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX1, 77],
                                    name: '性别分析',
                                    type: 'pie',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'left'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.sex
                                }]
                            };
                              sexChart.setOption(option);
                        });
                } else {
                    $('#sexChart').hide();
                    $('#sexChart').html('');
                    $('#sexChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.age.length > 0) {
                    var ageArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.age.length; i++){
                        var zan = {};
                        zan['name'] = data.age[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        ageArray.push(zan);
                    }
                    $('#ageChart').show();
                    $('#ageChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var ageChart = ec.init(document.getElementById('ageChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '年龄分布',
                                    x: titleX2,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX2,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: ageArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX2, 77],
                                    name: '年龄分布',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.age
                                }]
                            };
                            ageChart.setOption(option);
                        }
                    );
                } else {
                    $('#ageChart').html('');
                    $('#ageChart').hide();
                    $('#ageChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.hobby.length > 0) {
                    var hobbyArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.hobby.length; i++){
                        var zan = {};
                        zan['name'] = data.hobby[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        hobbyArray.push(zan);
                    }
                    $('#hobbyChart').show();
                    $('#hobbyChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var hobbyChart = ec.init(document.getElementById('hobbyChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '爱好分析',
                                    x: titleX3,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX3,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: hobbyArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX3, 77],
                                    name: '爱好分析',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.hobby
                                }]
                            };
                            hobbyChart.setOption(option);
                        }
                    );
                } else {
                    $('#hobbyChart').hide();

                    $('#hobbyChart').html('');
                    $('#hobbyChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.income.length > 0) {
                    var incomeArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.income.length; i++){
                        var zan = {};
                        zan['name'] = data.income[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        incomeArray.push(zan);
                    }
                    $('#incomeChart').show();
                    $('#incomeChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var incomeChart = ec.init(document.getElementById('incomeChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '收入水平',
                                    x: titleX1,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX1,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: incomeArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX1, 77],
                                    name: '收入水平',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.income
                                }]
                            };
                            incomeChart.setOption(option);
                        }
                    );
                } else {
                    $('#incomeChart').hide();

                    $('#incomeChart').html('');
                    $('#incomeChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.shop.length > 0) {
                    var shopArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.shop.length; i++){
                        var zan = {};
                        zan['name'] = data.shop[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        shopArray.push(zan);
                    }
                    $('#shopChart').show();
                    $('#shopChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var shopChart = ec.init(document.getElementById('shopChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '消费水平',
                                    x: titleX2,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX2,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: shopArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX2, 77],
                                    name: '消费水平',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.shop
                                }]
                            };
                            shopChart.setOption(option);
                        }
                    );
                } else {
                    $('#shopChart').hide();

                    $('#shopChart').html('');
                    $('#shopChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.marry.length > 0) {
                    var marryArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.marry.length; i++){
                        var zan = {};
                        zan['name'] = data.marry[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        marryArray.push(zan);
                    }
                    $('#marryChart').show();
                    $('#marryChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var marryChart = ec.init(document.getElementById('marryChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '婚姻状况',
                                    x: titleX3,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX3,
                                    y: options.legend.y,
                                    itemGap: options.legend.itemGap,
                                    orient: 'vertical',
                                    data: marryArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX3, 77],
                                    name: '婚姻状况',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.marry
                                }]
                            };
                            marryChart.setOption(option);
                        }
                    );
                } else {
                    $('#marryChart').hide();

                    $('#marryChart').html('');
                    $('#marryChart').css({
                        // 'background-image': 'url(./../../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
            }
            $('.loading-area').fadeOut();
        })
        .fail(function() {
            console.log("error");
        });
    }

    /*provider*/
    /*
    *bigRadius:外圆大小
    *smallRadius：内圆大小
    *seriesX1：圆心X轴位置
    *
    *
    */
    function getProviderData(bigRadius, smallRadius, seriesX1, seriesX2, seriesX3, legendX1, legendX2, legendX3, titleX1, titleX2, titleX3, titleY){
        $.ajax({
            url: BASEURL + 'admin/api/userProfile',
            type: 'GET',
            dataType: 'json',
            data: {
                id: id,
                startdate: startdate,
                enddate: enddate
            },
        })
        .done(function(data) {
            console.log(data);
            if (data.success) {
                console.log(data.provider.length);
                if (data.provider.length > 0) {
                    var providerArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.provider.length; i++){
                        var zan = {};
                        zan['name'] = data.provider[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        providerArray.push(zan);
                    }
                    $('#providerChart').show();
                    $('#providerChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var providerChart = ec.init(document.getElementById('providerChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '通讯类型',
                                    x: titleX1,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX1,
                                    y: options.legend.y,
                                    orient: 'vertical',
                                    data: providerArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX1, 77],
                                    name: '通讯类型',
                                    type: 'pie',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'left'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.provider
                                }]
                            };
                              providerChart.setOption(option);
                        });
                } else {
                    $('#providerChart').hide();
                    $('#providerChart').html('');
                    $('#providerChart').css({
                        'background-image': 'url(./../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                //provider
                if (data.network.length > 0) {
                    var networkArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.network.length; i++){
                        var zan = {};
                        zan['name'] = data.network[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        networkArray.push(zan);
                    }
                    $('#networkChart').show();

                    $('#networkChart').css({
                        'box-sizing': 'inherit',
                        'padding-top': '0px',
                        'color': '#ccc',
                        'background': '#fff'
                    });
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var networkChart = ec.init(document.getElementById('networkChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '网络类型',
                                    x: titleX2,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX2,
                                    y: options.legend.y,
                                    orient: 'vertical',
                                    data: networkArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX2,77],
                                    name: '网络类型',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.network
                                }]
                            };
                            networkChart.setOption(option);
                        }
                    );
                } else {
                    $('#networkChart').hide();
                    $('#networkChart').html('');
                    $('#networkChart').css({
                        'background-image': 'url(./../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                if (data.system.length > 0) {
                    var systemArray = [];//定义一个数组接收标题并加入圆点图片
                    for(var i = 0; i < data.system.length; i++){
                        var zan = {};
                        zan['name'] = data.system[i].name;
                        zan['icon'] = 'image://../images/pie_disc' + i + '.png';
                        systemArray.push(zan);
                    }
                    $('#systemChart').show();
                    $('#systemChart').css('background', '#fff');
                    require(
                        [
                            'echarts',
                            'echarts/chart/pie',
                        ],
                        function(ec) {
                            var systemChart = ec.init(document.getElementById('systemChart'));
                            var option = {
                                title: {
                                    show: true,
                                    text: '系统类型',
                                    x: titleX3,
                                    y: titleY,
                                    textStyle: options.title.textStyle
                                },
                                tooltip: {
                                    show: true,
                                    formatter: options.toolTip.format,
                                    textStyle: options.toolTip.textStyle
                                },
                                color: options.color,
                                legend: {
                                    x: legendX3,
                                    y: options.legend.y,
                                    orient: 'vertical',
                                    data: systemArray,
                                    textStyle: options.legend.textStyle
                                },
                                series: [{
                                    center: [seriesX3,77],
                                    name: '系统类型',
                                    type: 'pie',
                                    x: 'right',
                                    radius: [bigRadius, smallRadius],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: false
                                            },
                                            labelLine: {
                                                show: false
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: false,
                                            textStyle: {
                                                fontSize: '20',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: data.system
                                }]
                            };
                            systemChart.setOption(option);
                        }
                    );
                } else {
                    $('#systemChart').hide();
                    $('#systemChart').html('');
                    $('#systemChart').css({
                        'background-image': 'url(./../images/empty.jpg)',
                        'background-repeat': 'no-repeat',
                        'background-size': 'contain',
                        'background-position': 'center'
                    });
                }
                // if(data.provider.length <= 0 && data.network.length <= 0 && data.system.length <= 0){
                //     $('#providerChart').show();
                //     $('#networkChart').show();
                //     $('#systemChart').show();
                //     $('#providerChart').css('background', '#fff');
                //     $('#systemChart').css('background', '#fff');
                //     $('#networkChart').html('暂无数据');
                //     $('#networkChart').css({
                //         'box-sizing': 'border-box',
                //         'padding-top': '200px',
                //         'color': '#ccc',
                //         'background-image': 'url(./../images/empty.png)',
                //         'background-repeat': 'no-repeat',
                //         'background-size': 'contain',
                //         'background-position': 'center'
                //     });
                // }
            } else {
                $('#providerChart').hide();
                $('#networkChart').hide();
                $('#systemChart').hide();

                // $('#networkChart').html('暂无数据');
                // $('#networkChart').css({
                //     'box-sizing': 'border-box',
                //     'padding-top': '200px',
                //     'color': '#ccc',
                //     'background-image': 'url(./../images/empty.png)',
                //     'background-repeat': 'no-repeat',
                //     'background-size': 'contain',
                //     'background-position': 'center'
                // });
            }
            /** disappear loading */
            $('.loading-area').fadeOut();
        })
        .fail(function() {
            console.log("error");
        });
        // end
    }

    //请求测试数据
    // $.ajax({
    //     url: BASEURL + 'admin/api/usersTestData',
    //     type: 'POST',
    //     dataType: 'json',
    // })
    // .done(function(data) {
    //     // console.log(data);
    //     if(data.success){
    //         if (data.sex.length > 0) {
    //             var sexArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.sex.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.sex[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 sexArray.push(zan);
    //             }
    //             $('#sexChart').show();
    //             $('#sexChart').css({
    //                 'margin-top':'0'
    //             });
    //             $('#sexChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var sexChart = ec.init(document.getElementById('sexChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '性别分析',
    //                             x: options.title.x,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: options.legend.x,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: sexArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: options.series.center,
    //                             name: '性别分析',
    //                             type: 'pie',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'left'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.sex
    //                         }]
    //                     };
    //                       sexChart.setOption(option);
    //                 });
    //         } else {
    //             $('#sexChart').hide();
    //             $('#sexChart').html('');
    //             $('#sexChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.age.length > 0) {
    //             var ageArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.age.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.age[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 ageArray.push(zan);
    //             }
    //             $('#ageChart').show();
    //             $('#ageChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var ageChart = ec.init(document.getElementById('ageChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '年龄分布',
    //                             x: 73,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 190,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: ageArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [106, 77],
    //                             name: '年龄分布',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.age
    //                         }]
    //                     };
    //                     ageChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#ageChart').html('');
    //             $('#ageChart').hide();
    //             $('#ageChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.hobby.length > 0) {
    //             var hobbyArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.hobby.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.hobby[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 hobbyArray.push(zan);
    //             }
    //             $('#hobbyChart').show();
    //             $('#hobbyChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var hobbyChart = ec.init(document.getElementById('hobbyChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '爱好分析',
    //                             x: 149,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 266,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: hobbyArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [182, 77],
    //                             name: '爱好分析',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.hobby
    //                         }]
    //                     };
    //                     hobbyChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#hobbyChart').hide();

    //             $('#hobbyChart').html('');
    //             $('#hobbyChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.income.length > 0) {
    //             var incomeArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.income.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.income[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 incomeArray.push(zan);
    //             }
    //             $('#incomeChart').show();
    //             $('#incomeChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var incomeChart = ec.init(document.getElementById('incomeChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '收入水平',
    //                             x: options.title.x,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: options.legend.x,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: incomeArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: options.series.center,
    //                             name: '收入水平',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.income
    //                         }]
    //                     };
    //                     incomeChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#incomeChart').hide();

    //             $('#incomeChart').html('');
    //             $('#incomeChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.shop.length > 0) {
    //             var shopArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.shop.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.shop[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 shopArray.push(zan);
    //             }
    //             $('#shopChart').show();
    //             $('#shopChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var shopChart = ec.init(document.getElementById('shopChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '消费水平',
    //                             x: 75,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 190,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: shopArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [106, 77],
    //                             name: '消费水平',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.shop
    //                         }]
    //                     };
    //                     shopChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#shopChart').hide();

    //             $('#shopChart').html('');
    //             $('#shopChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.marry.length > 0) {
    //             var marryArray = [];//定义一个数组接收标题并加入圆点图片
    //             for(var i = 0; i < data.marry.length; i++){
    //                 var zan = {};
    //                 zan['name'] = data.marry[i].name;
    //                 zan['icon'] = 'image://../images/pie_disc' + i + '.png';
    //                 marryArray.push(zan);
    //             }
    //             $('#marryChart').show();
    //             $('#marryChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var marryChart = ec.init(document.getElementById('marryChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '婚姻状况',
    //                             x: 149,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 266,
    //                             y: options.legend.y,
    //                             itemGap: options.legend.itemGap,
    //                             orient: 'vertical',
    //                             data: marryArray,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [182, 77],
    //                             name: '婚姻状况',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.marry
    //                         }]
    //                     };
    //                     marryChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#marryChart').hide();

    //             $('#marryChart').html('');
    //             $('#marryChart').css({
    //                 // 'background-image': 'url(./../../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //     }
    //     $('.loading-area').fadeOut();
    // })
    // .fail(function() {
    //     console.log("error");
    // })

    /*provider*/
    // $.ajax({
    //     url: BASEURL + 'admin/api/userProfile',
    //     type: 'GET',
    //     dataType: 'json',
    //     data: {
    //         id: id,
    //         startdate: startdate,
    //         enddate: enddate
    //     },
    // })
    // .done(function(data) {
    //     console.log(data);
    //     if (data.success) {
    //         console.log(data.provider.length);
    //         if (data.provider.length > 0) {
    //             $('#providerChart').show();
    //             $('#providerChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var providerChart = ec.init(document.getElementById('providerChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '通讯类型',
    //                             x: options.title.x,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: options.legend.x,
    //                             y: options.legend.y,
    //                             orient: 'vertical',
    //                             data: data.provider,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: options.series.center,
    //                             name: '通讯类型',
    //                             type: 'pie',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'left'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.provider
    //                         }]
    //                     };
    //                       providerChart.setOption(option);
    //                 });
    //         } else {
    //             $('#providerChart').hide();
    //             $('#providerChart').html('');
    //             $('#providerChart').css({
    //                 'background-image': 'url(./../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         //provider
    //         if (data.network.length > 0) {
    //             $('#networkChart').show();

    //             $('#networkChart').css({
    //                 'box-sizing': 'inherit',
    //                 'padding-top': '0px',
    //                 'color': '#ccc',
    //                 'background': '#fff'
    //             });
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var networkChart = ec.init(document.getElementById('networkChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '网络类型',
    //                             x: 75,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 190,
    //                             y: options.legend.y,
    //                             orient: 'vertical',
    //                             data: data.network,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [106,77],
    //                             name: '网络类型',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.network
    //                         }]
    //                     };
    //                     networkChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#networkChart').hide();
    //             $('#networkChart').html('');
    //             $('#networkChart').css({
    //                 'background-image': 'url(./../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         if (data.system.length > 0) {
    //             $('#systemChart').show();
    //             $('#systemChart').css('background', '#fff');
    //             require(
    //                 [
    //                     'echarts',
    //                     'echarts/chart/pie',
    //                 ],
    //                 function(ec) {
    //                     var systemChart = ec.init(document.getElementById('systemChart'));
    //                     var option = {
    //                         title: {
    //                             show: true,
    //                             text: '系统类型',
    //                             x: 149,
    //                             y: options.title.y,
    //                             textStyle: options.title.textStyle
    //                         },
    //                         tooltip: {
    //                             show: true,
    //                             formatter: options.toolTip.format,
    //                             textStyle: options.toolTip.textStyle
    //                         },
    //                         color: options.color,
    //                         legend: {
    //                             x: 266,
    //                             y: options.legend.y,
    //                             orient: 'vertical',
    //                             data: data.system,
    //                             textStyle: options.legend.textStyle
    //                         },
    //                         series: [{
    //                             center: [182,77],
    //                             name: '系统类型',
    //                             type: 'pie',
    //                             x: 'right',
    //                             radius: ['76%', '55%'],
    //                             avoidLabelOverlap: false,
    //                             itemStyle: {
    //                                 normal: {
    //                                     label: {
    //                                         show: false
    //                                     },
    //                                     labelLine: {
    //                                         show: false
    //                                     }
    //                                 }
    //                             },
    //                             label: {
    //                                 normal: {
    //                                     show: false,
    //                                     position: 'center'
    //                                 },
    //                                 emphasis: {
    //                                     show: false,
    //                                     textStyle: {
    //                                         fontSize: '20',
    //                                         fontWeight: 'bold'
    //                                     }
    //                                 }
    //                             },
    //                             labelLine: {
    //                                 normal: {
    //                                     show: false
    //                                 }
    //                             },
    //                             data: data.system
    //                         }]
    //                     };
    //                     systemChart.setOption(option);
    //                 }
    //             );
    //         } else {
    //             $('#systemChart').hide();
    //             $('#systemChart').html('');
    //             $('#systemChart').css({
    //                 'background-image': 'url(./../images/empty.jpg)',
    //                 'background-repeat': 'no-repeat',
    //                 'background-size': 'contain',
    //                 'background-position': 'center'
    //             });
    //         }
    //         // if(data.provider.length <= 0 && data.network.length <= 0 && data.system.length <= 0){
    //         //     $('#providerChart').show();
    //         //     $('#networkChart').show();
    //         //     $('#systemChart').show();
    //         //     $('#providerChart').css('background', '#fff');
    //         //     $('#systemChart').css('background', '#fff');
    //         //     $('#networkChart').html('暂无数据');
    //         //     $('#networkChart').css({
    //         //         'box-sizing': 'border-box',
    //         //         'padding-top': '200px',
    //         //         'color': '#ccc',
    //         //         'background-image': 'url(./../images/empty.png)',
    //         //         'background-repeat': 'no-repeat',
    //         //         'background-size': 'contain',
    //         //         'background-position': 'center'
    //         //     });
    //         // }
    //     } else {
    //         $('#providerChart').hide();
    //         $('#networkChart').hide();
    //         $('#systemChart').hide();

    //         // $('#networkChart').html('暂无数据');
    //         // $('#networkChart').css({
    //         //     'box-sizing': 'border-box',
    //         //     'padding-top': '200px',
    //         //     'color': '#ccc',
    //         //     'background-image': 'url(./../images/empty.png)',
    //         //     'background-repeat': 'no-repeat',
    //         //     'background-size': 'contain',
    //         //     'background-position': 'center'
    //         // });
    //     }
    //     /** disappear loading */
    //     $('.loading-area').fadeOut();
    // })
    // .fail(function() {
    //     console.log("error");
    // });

}
var setBetweenTime = function() {
    rome(timeStart, {
        time: false,
        dateValidator: rome.val.beforeEq(timeEnd),
    });
    rome(timeEnd, {
        time: false,
        dateValidator: rome.val.afterEq(timeStart)
    });
}

login.init = function() {
    BASEURL = BASEURL || "";

    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    function banBackSpace(e) {
        var ev = e || window.event; //获取event对象
        var obj = ev.target || ev.srcElement; //获取事件源

        var t = obj.type || obj.getAttribute('type'); //获取事件源类型

        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        var vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;

        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vEnabled != true)) ? true : false;

        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") ? true : false;

        //判断
        if (flag2) {
            return false;
        }
        if (flag1) {
            return false;
        }
    }

    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = banBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown = banBackSpace;
};

login.initIndex = function(register,findback) {
    register = register || false;
    findback = findback || false;

    console.log(register);
    console.log(findback);

    var checkTel = function(tel) {
        var reg = /^0?1[34578][0-9]\d{8}$/;
        return reg.test(tel);
    };
    var checkName = function(name) {
        var reg = /^[\u4e00-\u9fa5]{2,10}$/;
        return reg.test(name);
    };

    if (register == 'true') {
        $('#login-container .loginRegister > div').eq(1).show();
    } else {
        if (findback == 'true') {
            $('#login-container .loginRegister > div').eq(2).show();
        } else {
            $('#login-container .loginRegister > div').eq(0).show();
        }
    }

    $('#login-container .login-logo').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL;
    });

    /** swiper */
    /*var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0,
        loop: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    });*/

    // tab转换
    $('index-main-content').hide();
    $('ul.index-fun-nav li:first a').addClass('index-tab-active').show();
    $('ul.index-fun-nav li:first').show();

    // $('ul.index-fun-nav li a').click(function(event) {
    //     $('.index-character').hide();
    //     $('ul.index-fun-nav li a').removeClass('index-tab-active');
    //     $(this).addClass('index-tab-active');
    //     $('.nav-tab-content').hide();
    //     var activeTab = $(this).attr("href");
    //     $(activeTab).fadeIn();
    //     return false;
    // });

    /*进入到管理中心button*/
    $('.button-backstage').click(function(event) {
        window.location.href= BASEURL + "login";
    });
    // 开发者选项
    $('.home-developer').click(function(event) {
        window.location.href = BASEURL + "admin/character/developer";
    });

    /** REGISTER */
    $('.register-tab ul > li').click(function(event) {
        /* Act on the event */
        $('.register-tab ul > li').each(function() {
            $(this).removeClass('active');
        });

        $(this).addClass('active');
    });

    //根据广告主和开发者决定是否显示芯片码
    $('.register-tab ul li:first').on('click',function(event) {
        // console.log($(this).val());
        $('#register-serial').parent().show();
        $('#show-developer').hide();
        $('#show-business').show();

    });
    $('.register-tab ul li:last').on('click',function(event) {
        // console.log($(this).val());
        $('#register-serial').parent().hide();
        $('#show-business').show();
        $('#show-developer').hide();
    });

    $(".index-container .switch div").on("click", function() {
        if (!$(this).hasClass("active")) {
            if ($(".index-login-container").css("display") === "block") {
                $(".index-login-container").hide();
                $(".index-register-container").show();
            } else {
                $(".index-login-container").show();
                $(".index-register-container").hide();
            }
        }
    });
    $(".index-form-forget").on("click", function() {
        $(".index-login-container").hide();
        $(".index-find-password-container").show();
    });
    $("#find-step1-button").on("click", function() {
        if (!checkTel($("#find-phone").val())) {
            $("#find-error-1").html("请输入正确的手机号").css('opacity', 1);
            return;
        }
        if (!$("#find-verfication").val()) {
            $("#find-error-1").html("请输入验证码").css('opacity', 1);
            return;
        }
        $.ajax({
            url: BASEURL + 'admin/api/resetPasswordAuth',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: $("#find-phone").val(),
                code: $("#find-verfication").val()
            }
        }).done(function(data) {
            if (data.status === 0) {
                $(".index-find-password-container .step1").hide();
                $(".index-find-password-container .step2").show();
            } else {
                $("#find-error-1").html(data.errMsg).css('opacity', 1);
            }
        }).fail(function() {
            $("#find-error-1").html("服务器错误").css('opacity', 1);
        });
    });
    $("#find-step2-button").on("click", function() {
        if (!$("#find-password").val()) {
            $("#find-error-2").html("请输入密码").css('opacity', 1);
            return;
        }
        if ($("#find-password").val().length < 6) {
            $("#find-error-2").html("密码太短").css('opacity', 1);
            return;
        }
        if ($("#find-password").val() !== $("#find-confirm-password").val()) {
            $("#find-error-2").html("两次密码不一致").css('opacity', 1);
            return;
        }
        $.ajax({
            url: BASEURL + 'admin/api/resetPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                password: $("#find-password").val(),
                password_confirmation: $("#find-confirm-password").val()
            }
        }).done(function(data) {
            if (data.status === 0) {
                $(".index-find-password-container .step2").hide();
                $(".index-find-password-container .tips").show();
                setTimeout(function() {
                    $(".index-find-password-container .tips").hide();
                    $(".index-find-password-container .step1").show();
                    $(".index-find-password-container").hide();
                    $(".index-login-container").show();
                }, 2000);
            } else {
                $("#find-error-2").html(data.errMsg).css('opacity', 1);
            }
        }).fail(function() {
            $("#find-error-2").html("服务器错误").css('opacity', 1);
        });
    });
    $("#login-button").on("click", function() {
        if (!checkTel($("#login-phone").val())) {
            $("#index-error").html("请输入正确的手机号").css('opacity', 1);
            return;
        }
        $("#index-error").css('opacity', 0);
        $(this).addClass("index-form-submit-on-progress").html("登录中");
        var _this = this;
        $.ajax({
            url: BASEURL + 'admin/api/login',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: $("#login-phone").val(),
                password: $("#login-password").val()
            }
        }).done(function(data) {
            if (data.status === 0) {
                window.location.href = BASEURL + data.redirect;
            } else {
                $("#index-error").html(data.errMsg).css('opacity', 1);
                $(_this).removeClass("index-form-submit-on-progress").html("登录");
            }
        }).fail(function() {
            $("#index-error").html("服务器错误").css('opacity', 1);
            $(_this).removeClass("index-form-submit-on-progress").html("登录");
        });
    });
    $('#login-password').on('keyup', function(event) {
        if (event.keyCode === 13) {
            $('#login-button').trigger('click');
        }
    });
    $("#register-button").on("click", function() {
        var activeVal = $('.register-tab ul > .active').val();
        // console.log(activeVal);
        if (!checkTel($("#register-phone").val())) {
            $("#reg-error").html("请输入正确的手机号").css('opacity', 1);
            return;
        }
        if (activeVal == 2){
            if (!$("#register-serial").val()) {
                $("#reg-error").html("请输入正确的芯片码").css('opacity', 1);
                return;
            }
        }
        $("#reg-error").css('opacity', 0);
        $(this).addClass("index-form-submit-on-progress").html("提交中");
        var registerBtn = $(this);

        function registerRequest() {
            $.ajax({
                url: BASEURL + 'admin/api/register',
                type: 'POST',
                dataType: 'json',
                data: {
                    phone: $("#register-phone").val(),
                    password: $("#register-password").val(),
                    code: $("#register-code").val(),
                    user_type_id: activeVal,
                }
            }).done(function(data) {
                if (data.status === 0) {
                    $(".index-register-container .main").hide();
                    $(".index-register-container .tips").show();
                    var loginBtn = $(this);

                    $.ajax({
                        url: BASEURL + 'admin/api/login',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            phone: $("#register-phone").val(),
                            password: $("#register-password").val()
                        }
                    }).done(function(data) {
                        if (data.status === 0) {
                            window.location.href = BASEURL + "admin/supporter";
                        } else {
                            $("#index-error").html(data.errMsg).css('opacity', 1);
                            loginBtn.removeClass("index-form-submit-on-progress").html("登录");
                        }
                    }).fail(function() {
                        $("#index-error").html("服务器错误").css('opacity', 1);
                        loginBtn.removeClass("index-form-submit-on-progress").html("登录");
                    });
                } else {
                    $("#reg-error").html(data.errMsg).css('opacity', 1);
                    registerBtn.removeClass("index-form-submit-on-progress").html("注册");
                }
            }).fail(function() {
                $("#reg-error").html("服务器错误").css('opacity', 1);
                registerBtn.removeClass("index-form-submit-on-progress").html("注册");
            });
        }

        if (activeVal == 2){
            $.ajax({
                url: BASEURL + 'api/verifyChipSerial/vi',
                type: 'POST',
                dataType: 'json',
                data: {
                    serail: $("#register-serial").val()
                },
            })
            .done(function(data) {
                console.log(data);
                if (data.success) {
                    registerRequest();
                } else {
                    $("#reg-error").html("芯片码验证错误").css('opacity', 1);
                    registerBtn.removeClass("index-form-submit-on-progress").html("注册");
                }
            })
            .fail(function() {
                $("#reg-error").html("服务器错误").css('opacity', 1);
                registerBtn.removeClass("index-form-submit-on-progress").html("注册");
            })
        } else {
            registerRequest();
        }


    });
    $(".close-button").on("click", function() {
        if ($(this).hasClass('return-to-login')) {
            $(".index-find-password-container").hide();
            $(".index-find-password-container .step1").show();
            $(".index-find-password-container .step2").hide();
            $(".index-find-password-container .tips").hide();
            $(".index-login-container").show();
        }
    });
    $("#get-register-code").on("click", function() {
        if (!checkTel($("#register-phone").val())) {
            $("#reg-error").html('请输入正确的手机号').css('opacity', 1);
            return;
        }

        $(this).attr("disabled", "disabled").html("发送中");

        var _this = this;
        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: $("#register-phone").val()
            }
        }).done(function(data) {
            // console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送");
                var timer = 60;
                setTimeout(function(){
                    var times = setInterval(function(){
                        timer--;
                        $(_this).html(timer + "秒");
                        if (timer < 0){
                            $(_this).removeAttr('disabled').html("发送");
                            $(_this).css({
                                "background-color": "#e9e9e9",
                                'color': "#999",
                                'cursor': 'pointer'
                            });
                            clearInterval(times);
                        }
                    },1000);
                },500);
                $(_this).css({
                    "background-color": "#6799ff",
                    color: "#fff",
                    'cursor': 'default'
                });
            } else {
                $("#reg-error").html(data.errMsg).css('opacity', 1);
            }
        }).fail(function() {
            $("#reg-error").html("服务器错误").css('opacity', 1);
        });
    });
    $("#find-get-code-button").on("click", function() {
        if (!checkTel($("#find-phone").val())) {
            $("#find-error-1").html("请输入正确的手机号").css('opacity', 1);
            return;
        }

        $(this).attr("disabled", "disabled").html("发送中");

        var _this = this;
        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: $("#find-phone").val()
            }
        }).done(function(data) {
            // console.log(data);
            if (data.status === 0) {
                $(_this).html("已发送").attr("disabled", "disabled");
                var timer = 60;
                setTimeout(function(){
                    var times = setInterval(function(){
                        timer--;
                        $(_this).html(timer + "秒");
                        if (timer < 0){
                            $(_this).removeAttr('disabled').html("发送");
                            $(_this).css({
                                "background-color": "#e9e9e9",
                                'color': "#999",
                                'cursor': 'pointer'
                            });
                            clearInterval(times);
                        }
                    },1000);
                },500);
                $(_this).css({
                    border: "#ccc",
                    "background-color": "#ccc",
                    color: "#fff"
                });
            } else {
                $("#find-error-1").html(data.errMsg).css('opacity', 1);
            }
        }).fail(function() {
            $("#find-error-1").html("服务器错误").css('opacity', 1);
        });
    });
};
