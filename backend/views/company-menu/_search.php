<?php

use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>

<style>
    /*label{display: none;}*/
</style>

<script>
//    $(document).ready(function(){
//        $("#searchForm").submit(function() {
////            alert('1');
//            reloadForm();
//            return false;
//        });
//    });

    $("#search").on('click', function(){
//        alert('reset');
        reloadForm();
    });

    $("#reset").on('click', function(){
        //        alert('reset');
        clearForm("searchForm");
    });
</script>
<div class="list-search-form">

    <?php $form = ActiveForm::begin([
        'id' => 'searchForm',
        'action' => ['list'],
        'method' => 'get',
    ]); ?>
    <table  border="0">
        <tr>
            <td>
                <?= $form->field($model, 'menu_code')->textInput() ?>
            </td>
            <td>
                <?= $form->field($model, 'menu_name')->textInput() ?>
            </td>
            <td>
                <?= $form->field($model, 'menu_type')->dropDownList([
                    'portal'=>Yii::t('common','menu_type_portal'),
                    'report'=>Yii::t('common','menu_type_report'),
                    'tool-box'=>Yii::t('common','menu_type_tool_box'),
                    'portal-menu'=>Yii::t('common','menu_type_portal_menu')],
                    ['prompt'=>Yii::t('common','all_data')]) ?>
            </td>
            <td>
                <?= $form->field($model, 'status')->dropDownList([
                    '1'=>Yii::t('common','status_normal'),
                    '2'=>Yii::t('common','status_stop')],
                    ['prompt'=>Yii::t('common','all_data')]) ?>
            </td>
            <td>
                <?php if ($includeSubNode == '1') :?>
                    <?= Html::checkbox('includeSubNode',true) ?><?= Yii::t('common','include_sub_node')?>
                <?php else: ?>
                    <?= Html::checkbox('includeSubNode',false) ?><?= Yii::t('common','include_sub_node')?>
                <?php endif ?>
            </td>
            <td>
                <?= Html::button(Yii::t('common', 'search'), ['class' => 'btn btn-primary', 'id'=>'search']) ?>
                <?= Html::button(Yii::t('common', 'reset'), ['class' => 'btn btn-default', 'id'=>'reset']) ?>
            </td>
        </tr>
    </table>


    <?php ActiveForm::end(); ?>

</div>