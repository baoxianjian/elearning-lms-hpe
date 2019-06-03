<?php
/**
 * Created by PhpStorm.
 * User: adophper
 * Date: 2015/12/10
 * Time: 11:16
 */
use yii\helpers\Url;
use common\helpers\TStringHelper;
use common\models\learning\LnExamination;
use common\models\learning\LnExaminationQuestion;
use common\models\learning\LnExamPaperQuestion;
use common\models\learning\LnExamQuestionOption;
use components\widgets\TBreadcrumbs;

$this->params['breadcrumbs'][] = ['label'=> $course->course_name, 'url'=>['resource/course/view', 'id' => $course->kid]];
$this->params['breadcrumbs'][] = ['label'=> Yii::t('common', 'user_examination'), 'url'=>['resource/course/play', 'modResId' => $modResId]];
//$this->params['breadcrumbs'][] = ['label'=>Yii::t('common','exam_management_question'),'url'=>['/exam-manage-main/question']];
$this->params['breadcrumbs'][] = Yii::t('common','show_answer');
$this->params['breadcrumbs'][] = '';

if (!$dialog){
?>
<div class="container">
    <div class="row">
        <div class="col-md-9 col-xs-12 bd">
            <div class="modal-header">
                <h4 class="modal-title"><?=$examination->title?></h4>
            </div>
<?php
}else{
?>
<div class="header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">查看考试结果</h4>
</div>
<div class="content">
    <div class="row">
        <div class="col-md-9 col-xs-12 bd">
<?php
}
?>
            <div class="modal-body">
                <div class="courseInfo">
                    <div role="tabpanel" class="tab-pane active" id="teacher_info">
                        <div class=" panel-default scoreList">
                            <div class="panel-body">
                                <div class="infoBlock pages" data-page="1">
                                    <?php
                                    if (!empty($paperQuestion)){
                                    $page = 1;
                                    $j = 1;
                                    $itemRight = [];
                                    foreach ($paperQuestion as $key => $item){
                                    if (!empty($item['options']) && $item['relation_type'] == LnExamPaperQuestion::RELATION_TYPE_PAPER){
                                        $examinationQuestion = new LnExaminationQuestion();
                                        $question_type = $examinationQuestion->getExamQuestionCategoryName($item['examination_question_type']);
                                        $allRight = [];
                                        ?>
                                        <div class="row questionGroup_quest" data-num="<?=$j?>">
                                            <div class="col-md-12 col-sm-12">
                                                <div class="form-group form-group-sm">
                                                    <label class="col-sm-12 control-label">
                                                        <?=$j?>.【<?=$question_type?>】<?=$item['title']?>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-12 col-sm-12">
                                                <?php
                                                if ($item['examination_question_type'] == LnExaminationQuestion::EXAMINATION_QUESTION_TYPE_RADIO){
                                                    $checked = null;
                                                    foreach ($item['options'] as $i => $val) {
                                                        if (isset($val['is_checked'])){
                                                            $checked = chr(ord('A')+$i);
                                                        }
                                                        if ($val['is_right_option'] == LnExamQuestionOption::IS_RIGHT_OPTION_YES){
                                                            $allRight[] = chr(ord('A')+$i);
                                                        }
                                                    ?>
                                                        <div class="options">
                                                            <label style="margin-right:40px;">
                                                                <input name="options[<?=$val['examination_question_user_id']?>]" type="radio" value="<?=$val['kid']?>" class="<?=$item['kid']?>" <?=isset($val['is_checked'])?'checked':''?>> <?=chr(ord('A')+$i)?> <?=$val['option_title']?>
                                                            </label>
                                                        </div>
                                                        <?php
                                                    }
                                                }else if ($item['examination_question_type'] == LnExaminationQuestion::EXAMINATION_QUESTION_TYPE_CHECKBOX){
                                                    $checked = [];
                                                    foreach ($item['options'] as $i => $val) {
                                                        if (isset($val['is_checked'])){
                                                            $checked[] = chr(ord('A')+$i);
                                                        }
                                                        if ($val['is_right_option'] == LnExamQuestionOption::IS_RIGHT_OPTION_YES){
                                                            $allRight[] = chr(ord('A')+$i);
                                                        }
                                                    ?>
                                                        <div class="options">
                                                            <label style="margin-right:40px;">
                                                                <input name="options[<?=$val['examination_question_user_id']?>][]" type="checkbox" value="<?=$val['kid']?>" class="<?=$item['kid']?>" <?=isset($val['is_checked'])?'checked':''?>> <?=chr(ord('A')+$i)?> <?=$val['option_title']?>
                                                            </label>
                                                        </div>
                                                        <?php
                                                    }
                                                }else if ($item['examination_question_type'] == LnExaminationQuestion::EXAMINATION_QUESTION_TYPE_INPUT){
                                                    /**/
                                                }else if ($item['examination_question_type'] == LnExaminationQuestion::EXAMINATION_QUESTION_TYPE_JUDGE){
                                                    ?>
                                                    <div class="options">
                                                        <label style="margin-right:40px;">
                                                            <input type="radio" class="<?=$item['kid']?>" onclick="return false;" <?=isset($item['is_checked']) && $item['values']?'checked':''?>> 正确
                                                        </label>
                                                    </div>
                                                    <div class="options">
                                                        <label style="margin-right:40px;">
                                                            <input type="radio" class="<?=$item['kid']?>" onclick="return false;" <?=isset($item['is_checked']) && !$item['values']?'checked':''?>> 错误
                                                        </label>
                                                    </div>
                                                    <?php
                                                    $allRight = $item['values'] ? array('错误') : array('正确');
                                                    $checked = !isset($item['is_checked']) ? null : ($item['values'] ? '正确' : '错误');
                                                }else if ($item['examination_question_type'] == LnExaminationQuestion::EXAMINATION_QUESTION_TYPE_QA){
                                                    /**/
                                                }
                                                ?>
                                                <div class="options option_answers">
                                                    <?php
                                                    if (!$item['is_yes']) {
                                                        if (is_array($checked) ) sort($checked);
                                                    ?>
                                                    <p><i class="glyphicon glyphicon-remove"></i>
                                                        正确答案是 <strong><?=!empty($allRight) ? join('、',array_unique($allRight)) : $allRight?></strong>, 你的回答是 <strong><?= $checked ? (is_array($checked) ? join('、', $checked) : $checked) : '--' ?></strong>, 回答错误.
                                                    </p>
                                                    <?php
                                                    }else {
                                                        $itemRight[] = $item['kid'];
                                                    ?>
                                                    <p><i class="glyphicon glyphicon-ok"></i>
                                                        你的回答是正确.
                                                    </p>
                                                    <?php
                                                    }
                                                    if (!empty($item['answer']) && $examination->answer_view == LnExamination::ANSWER_VIEW_YES){
                                                    ?>
                                                    <p>解析:</p>
                                                    <p><?=$item['answer']?></p>
                                                    <?php
                                                    }
                                                    ?>
                                                </div>
                                            </div>
                                        </div>
                                        <?php
                                        $j ++;
                                    }else{
                                    $page ++;
                                    ?>
                                    <hr>
                                    <div class="row">
                                        <div class="centerBtnArea">
                                            <!-- 上一页下一页按钮 -->
                                            <?php
                                            if ($page > 2) {
                                                ?>
                                                <a href="###" class="btn btn-sm btn-success centerBtn prevPage" style="width:20%">上一页</a>
                                                <?php
                                            }
                                            if ($page <= $countPage) {
                                                ?>
                                                <a href="###" class="btn btn-sm btn-success centerBtn nextPage" style="width:20%">下一页</a>
                                                <?php
                                            }
                                            ?>
                                        </div>
                                    </div>
                                    <?php
                                    if ($page <= $countPage){
                                    ?>
                                </div>
                                <div class="infoBlock pages hidden" data-page="<?=$page?>">
                                    <?php
                                    }
                                    }
                                    ?>
                                    <?php
                                    }
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3 col-xs-12 bd">
            <div class="modal-header">
                <h4 class="modal-title">
                    总用时: <strong data="<?=$model->examination_duration?>"><?=!empty($model->examination_duration) ? TStringHelper::timeSecondToHMS($model->examination_duration) : '--'?></strong>
                </h4>
            </div>
            <div class="modal-body" style="min-height:400px;">
                <p>共<?=($j - 1)?>题,正确<?=count($itemRight)?>题</p>
                <div class="answerStatu">
                    <ul>
                        <?php
                        if (!empty($paperQuestion)){
                            $m = 1;
                            foreach ($paperQuestion as $val){
                                if (!empty($val['options']) && $val['relation_type'] == LnExamPaperQuestion::RELATION_TYPE_PAPER){
                        ?>
                        <li class="<?=(!empty($itemRight) && in_array($val['kid'], $itemRight)) ? '' : 'undone'?> answer_<?=$val['kid']?>" id="answer_<?=$m?>"><span><?=$m?></span></li>
                        <?php
                                    $m++;
                                }
                            }
                        }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="c"></div>
</div>
<script>

$(function(){
    $(".prevPage").on('click', function(){
        var parents = $(this).parents('.pages');
        parents.prev().removeClass('hidden');
        parents.addClass('hidden');
        $(window).scrollTop(0);
    });
    $(".nextPage").on('click', function(){
        var parents = $(this).parents('.pages');
        parents.next().removeClass('hidden');
        parents.addClass('hidden');
        $(window).scrollTop(0);
    });
});
</script>
