<?php
use yii\helpers\Html;
use yii\helpers\Url;
use components\widgets\TBreadcrumbs;
use yii\widgets\ActiveForm;
use common\helpers\TStringHelper;

$this->pageTitle = Yii::t('frontend', 'vender_vender_conf');// Yii::t('frontend', 'page_lesson_hot_title');
$this->params['breadcrumbs'][] = ['label' => Yii::t('frontend', 'tag_res_manage'), 'url' => ['resource/index']];
$this->params['breadcrumbs'][] = $this->pageTitle;
?>
<div class="headBanner5"></div>
<div class="container">
    <div class="row">
        <ol class="breadcrumb">
            <?= TBreadcrumbs::widget([
                'tag' => 'ol',
                'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            ]) ?>
        </ol>
        <div class="col-md-12">
            <div class="row">
                <div class="panel panel-default topBordered">
                    <div class="groupBlock">
                        <div class="blockHead" style="border-bottom:1px solid #eee;">
                            <span class="sharedTitle"><?=Yii::t('frontend', 'vender_vender_conf')?></span>
                        </div>
                        <div class="panel-body">
                            <div class="col-md-12 col-sm-12">
                                <div class="actionBar">
                                    <div class="btn-group">
                                        <a class="btn btn-success  pull-left" onclick="addview()"><?=Yii::t('frontend', 'vender_new_vender')?></a>
                                    </div>
                                    <form class="form-inline pull-right">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id='keyword' placeholder="<?=Yii::t('frontend', 'vender_code_or_name')?>">
                                            <button type="button" onclick="tableclear()"
                                                    class="btn btn-default pull-right"><?=Yii::t('frontend', 'reset')?>
                                            </button>
                                            <button type="button" class="btn btn-primary pull-right" onclick="search()"
                                                    style="margin-left:10px;"><?=Yii::t('frontend', 'tag_query')?>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div id="content">
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="delete" class="ui modal">
    <div class="header"><?=Yii::t('frontend', 'tag_del')?>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
        </button>
    </div>
    <div class="content">
        <p><?=Yii::t('frontend', 'tag_sure_to_del')?></p>
    </div>
    <div class="actions">
        <div class="btn btn-default ok"><?=Yii::t('frontend', 'be_sure')?></div>
        <div class="btn btn-default cancel"><?= Yii::t('frontend', 'page_info_good_cancel') ?></div>
    </div>
</div>
<!-- 新建供应商弹出窗口 -->

<div id="newPlace" class="ui modal">
    <div class="header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title" id="myModalLabel"><?=Yii::t('frontend', 'vender_new_vender')?></h4>
    </div>
    <div class="content">
        <div class="courseInfo">
            <div role="tabpanel" class="tab-pane active" id="new-vendor">
                <div class=" panel-default scoreList">
                    <div class="panel-body">
                        <div class="infoBlock">
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'tag_mingcheng')?></label>
                                        <div class="col-sm-9">
                                            <input class="form-control pull-left" type="text" id="title" data-mode="COMMON" data-delay="1" data-condition="required" data-alert="123" maxlength="50"
                                                   placeholder="<?=Yii::t('frontend', 'vender_type_name')?>" style="width:100%">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'vender_code')?></label>
                                        <div class="col-sm-9">
                                            <input class="form-control pull-left" type="text" id="code" data-mode="COMMON" data-delay="1" data-condition="required" data-alert="123"  onkeyup="if(check(value)){value=value.replace(/[\u4E00-\u9FA5]/ig,'')}" maxlength="50"
                                                   placeholder="<?=Yii::t('frontend', 'vender_type_code')?>" style="width:100%">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?= Yii::t('common', 'description') ?></label>
                                        <div class="col-sm-9">
                                            <textarea style="width:100%" placeholder="<?=Yii::t('frontend', 'input_{value}',['value'=>Yii::t('common', 'description')])?>" maxlength="500"
                                                      id="description"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12 centerBtnArea">

                                    <a href="###" class="btn btn-success btn-sm centerBtn" onclick="add()"><?=Yii::t('common', 'save')?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>  <!-- 新建供应商弹出窗口 -->

<div id="updateplace" class="ui modal">
    <div class="header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title" id="myModalLabel"><?=Yii::t('frontend', 'vender_change')?></h4>
    </div>
    <div class="content">
        <input id="updateid" type="hidden" value=""/>
        <div class="courseInfo">
            <div role="tabpanel" class="tab-pane active" id="update-vendor">
                <div class=" panel-default scoreList">
                    <div class="panel-body">
                        <div class="infoBlock">
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'tag_mingcheng')?></label>
                                        <div class="col-sm-9">
                                            <input class="form-control pull-left" type="text" id="updatetitle" data-mode="COMMON" data-delay="1" data-condition="required" data-alert="123"  maxlength="50" placeholder="<?=Yii::t('frontend', 'tag_mingcheng')?>" style="width:100%">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'vender_code')?></label>
                                        <div class="col-sm-9">
                                            <input class="form-control pull-left" type="text" id="updatecode"  data-mode="COMMON" data-delay="1" data-condition="required" data-alert="123" onkeyup="if(check(value)){value=value.replace(/[\u4E00-\u9FA5]/ig,'')}" maxlength="50" placeholder="<?=Yii::t('frontend', 'be_sure')?>" style="width:100%">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?= Yii::t('common', 'description') ?></label>
                                        <div class="col-sm-9">
                                            <textarea style="width:100%" placeholder="<?=Yii::t('frontend', 'input_{value}',['value'=>Yii::t('common', 'description')])?>" maxlength="500"  id="updatedescription"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12 centerBtnArea">
                                    <a href="###" class="btn btn-success btn-sm centerBtn" onclick="update()"><?=Yii::t('common', 'save')?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 查看供应商弹出窗口 -->
<div id="viewPlace" class="ui modal">
    <div class="header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title" id="myModalLabel"><?=Yii::t('frontend', 'vender_view_vender')?></h4>
    </div>
    <div class="content">
        <div class="courseInfo">
            <div role="tabpanel" class="tab-pane active" id="teacher_info">
                <div class=" panel-default scoreList">
                    <div class="panel-body">
                        <div class="infoBlock">
                              <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'tag_mingcheng')?></label>
                                        <div class="col-sm-9" id="viewname">HP001
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'vender_code')?></label>
                                        <div class="col-sm-9" id="viewcode">1
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group form-group-sm">
                                        <label class="col-sm-3 control-label"><?=Yii::t('frontend', 'vender_desc')?></label>
                                        <div class="col-sm-9" id="viewdescription">培训场地位于重庆大学第五教学楼103教室,拥有全方位的电子教学仪器设备
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-sm-12 centerBtnArea">
                                    <a href="###" class="btn btn-success btn-sm centerBtn" onclick="closeview()"><?=Yii::t('frontend', 'vender_close')?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    var container = 'content';
    var url = "<?=Url::toRoute(['vendor/content'])?>";
    var is_clear = 1;
    var page = 1;
    var key = '';
    var refresh = '';
    var keyrecordnow = '';
    var addOnoff = "<?=$add?>"
    app.extend("alert");
    window.onload = function () {
        setTimeout(function (){
            __PS.place.tableList();
            if(addOnoff){
                addview();
            }
        }, 0);
    };
    var __PS = {};
    __PS.place = {
        tableList: function () {
            if (is_clear) {
                $("#" + container).empty();
                page = 1;
                end = false;
            }
            ajaxGet(url, container);
        },
    }
    function delcfm(id) {
        app.alertSmall('#delete', {
            ok: function () {
                var tableurl = "<?=Url::toRoute(['vendor/update'])?>";
                var type = 'del';

                json = {"type": type, "kid": id,};

                $.get(tableurl, json, function (data) {
                    is_clear = 1;
                    if (is_clear) {
                        $("#" + container).empty();
                        page = 1;
                        end = false;
                    }

                    var keyurl = encodeURI(key);
                    ajaxGet(url + '?keyword=' + keyurl + '&page=' + page, container);
                });

                return true;

            },
            cancel: function () {
                return true;
            }
        });

    }
    ;
    function check(s){
        var regu =/[\u4E00-\u9FA5]/ig;
        var re = new RegExp(regu);
        if (re.test(s)) {
            return true;
        }else{
            return false;
        }
    };
    function closeview() {
        app.hideAlert('#viewPlace');
    }
    function tableclear() {
        $('#keyword').val('');
    }
    function stop(id,type) {
        var tableurl = "<?=Url::toRoute(['vendor/update'])?>";

        json = {"type": type, "kid": id,};

        $.get(tableurl, json, function (data) {
            //var keyurl = encodeURI(key);
           // ajaxGet(url + '?keyword=' + keyurl + '&page=' + page, container);
            if(type == 'start'){
                $('#stop_'+id).attr('title','<?=Yii::t('frontend', 'vender_off')?>');
                $('#stop_'+id).attr('onclick','stop("'+id+'","stop")');
                $('#stop_'+id).removeClass('glyphicon-ok-circle');
                $('#stop_'+id).addClass('glyphicon-remove-circle');
                $('#status_'+id).empty().attr('style','').append('<?=Yii::t('frontend', 'vender_ok')?>')

            }else{
                $('#stop_'+id).attr('title','<?=Yii::t('frontend', 'vender_on')?>');
                $('#stop_'+id).attr('onclick','stop("'+id+'","start")');
                $('#stop_'+id).removeClass('glyphicon-remove-circle');
                $('#stop_'+id).addClass('glyphicon-ok-circle');
                $('#status_'+id).empty().attr('style','color:red').append('<?=Yii::t('frontend', 'vender_off')?>')

            }
        });

    }
    ;
    function view(id) {
        app.alertSmall('#viewPlace');
        var code = app.clean($('#code_' + id).attr('title'));
        var address_name = app.clean($('#address_name_' + id).attr('title'));
        var description = app.clean($('#description_' + id).attr('title'));
        $("#updateid").val(id);
        $('#viewcode').html('').append(code);
        $('#viewname').html('').append(address_name);
        $('#viewdescription').html('').append(description);
    }
    ;
    function search() {
        var keyword = $('#keyword').val();
        ajaxGet(url + '?keyword=' + encodeURIComponent(keyword) + '&page=' + page, container);

    }
    function update() {
        var id = $("#updateid").val();
        var tableurl = "<?=Url::toRoute(['vendor/update'])?>";
        var isseturl = "<?=Url::toRoute(['vendor/isset'])?>";

        var type = 'update';
        var code = $('#updatecode').val();
        var title = $('#updatetitle').val();
        var description = $('#updatedescription').val();
        jsonisset = {"kid": id,"title":title,"code":code,"type":'update'};
        json = {"type": type, "kid": id, "title": title,"code":code, "description": description,};

        var validation = app.creatFormValidation("#update-vendor");
        $.getJSON(isseturl,jsonisset,function(data){
            if(data.isset){
                $.get(tableurl, json, function () {
                    is_clear = 1;
                    if (is_clear) {
                        $("#" + container).empty();
                        page = 1;
                        end = false;
                    }
                    var keyurl = encodeURI(key);
                    ajaxGet(url + '?keyword=' + keyurl + '&page=' + page, container);
                    app.hideAlert("#updateplace");
                });
            }else{
                if(data.isnull){
                    validation.showAlert("input[id=title]", "<?=Yii::t('frontend', 'vender_vname_null')?>");
                }else if(data.name){
                    validation.showAlert("input[id=updatetitle]", "<?=Yii::t('frontend', 'vender_vname_exist')?>");
                }
                if(data.code){
                    validation.showAlert("input[id=updatecode]", "<?=Yii::t('frontend', 'vender_vcode_exist')?>");
                }
                return false;
            }
        })

    }
    ;
    function addview() {
        app.alertSmall('#newPlace');
        var validation = app.creatFormValidation("#new-vendor");
        validation.hideAlert("input[id=code]")
        validation.hideAlert("input[id=title]")
        $('#code').val('');
        $('#title').val('');
        $('#description').val('');
    }
    function updateview(id) {
        app.alertSmall('#updateplace');
        var validation = app.creatFormValidation("#update-vendor");
        validation.hideAlert("input[id=updatecode]")
        validation.hideAlert("input[id=updatetitle]")
        $("#updateid").val(id);
        $('#updatecode').val($('#code_' + id).attr('title'));
        $('#updatetitle').val($('#address_name_' + id).attr('title'));
        $('#updatedescription').val($('#description_' + id).attr('title'));
    }
    function add() {
        var tableurl = "<?=Url::toRoute(['vendor/add'])?>";
        var isseturl = "<?=Url::toRoute(['vendor/isset'])?>";

        var code = $('#code').val();
        var title = $('#title').val();
        var description = $('#description').val();
        jsonisset = {"title":title,"code":code,"type":'add'};
        json = {"title": title,"code":code, "description": description,};

        var validation = app.creatFormValidation("#new-vendor");
        $.getJSON(isseturl,jsonisset,function(data){
            if(data.isset){
                $.get(tableurl, json, function () {
                    is_clear = 1;
                    if (is_clear) {
                        $("#" + container).empty();
                        page = 1;
                        end = false;
                    }
                    var keyurl = encodeURI(key);
                    ajaxGet(url + '?keyword=' + keyurl + '&page=' + page, container);
                    $('#code').val('');
                    $('#title').val('');
                    $('#description').val('');
                    app.hideAlert("#newPlace");
                });
            }else{
                if(data.isnull){
                    validation.showAlert("input[id=title]", "<?=Yii::t('frontend', 'vender_vname_null')?>");
                }else if(data.name){
                    validation.showAlert("input[id=title]", "<?=Yii::t('frontend', 'vender_vname_exist')?>");
                }
                if(data.code){
                    validation.showAlert("input[id=code]", "<?=Yii::t('frontend', 'vender_vcode_exist')?>");
                }
                return false;
            }
        })
    }
    ;
</script>
