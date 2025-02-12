// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

//
// SCORM 1.2 API Implementation
//
function AICCapi(courseRegId,courseCompleteProcessId,courseCompleteFinalId,def, cmiobj, cmiint, cmicommentsuser, cmicommentslms, cmistring256, cmistring4096, scormdebugging, scormauto, scormid, recordUrl, sessionKey, scoid, attempt, viewmode, modResId, currentorg, autocommit) {
    //alert('AICCapi start');
    //var prerequrl = cfgwwwroot + "/mod/scorm/prereqs.php?a=" + scormid + "&scoid=" + scoid + "&attempt=" + attempt + "&mode=" + viewmode + "&currentorg=" + currentorg + "&sesskey=" + sesskey;
    //var datamodelurl = cfgwwwroot + "/mod/scorm/datamodel.php";
    //var datamodelurlparams = "id=" + cmid + "&a=" + scormid + "&sesskey=" + sesskey + "&attempt=" + attempt + "&scoid=" + scoid;
    var VIEWMODE = viewmode;
    // Standard Data Type Definition
    var CMIString256 = '^.{0,255}$';
    var CMIString4096 = '^.{0,4096}$';
    var CMITime = '^([0-2]{1}[0-9]{1}):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})(\.[0-9]{1,2})?$';
    var CMITimespan = '^([0-9]{2,4}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$';
    var CMIInteger = '^\\d+$';
    var CMISInteger = '^-?([0-9]+)$';
    var CMIDecimal = '^-?([0-9]{0,3})(\.[0-9]{1,2})?$';
    var CMIIdentifier = '^\\w{1,255}$';
    var CMIFeedback = CMIString256; // This must be redefined
    var CMIIndex = '[._](\\d+).';

    // Vocabulary Data Type Definition
    var CMIStatus = '^passed$|^completed$|^failed$|^incomplete$|^browsed$';
    var CMIStatus2 = '^passed$|^completed$|^failed$|^incomplete$|^browsed$|^not attempted$';
    var CMIExit = '^time-out$|^suspend$|^logout$|^$';
    var CMIType = '^true-false$|^choice$|^fill-in$|^matching$|^performance$|^sequencing$|^likert$|^numeric$';
    var CMIResult = '^correct$|^wrong$|^unanticipated$|^neutral$|^([0-9]{0,3})?(\.[0-9]{1,2})?$';
    var NAVEvent = '^previous$|^continue$';

    // Children lists
    var cmi_children = 'core, suspend_data, launch_data, comments, objectives, student_data, student_preference, interactions';
    var core_children = 'student_id, student_name, lesson_location, credit, lesson_status, entry, score, total_time, lesson_mode, exit, session_time';
    var score_children = 'raw, min, max';
    var comments_children = 'content, location, time';
    var objectives_children = 'id, score, status';
    var student_data_children = 'attempt_number, tries, mastery_score, max_time_allowed, time_limit_action';
    var student_preference_children = 'audio, language, speed, text';
    var interactions_children = 'id, objectives, time, type, correct_responses, weighting, student_response, result, latency';

    // Data ranges
    var score_range = '0#100';
    var audio_range = '-1#100';
    var speed_range = '-100#100';
    var weighting_range = '-100#100';
    var text_range = '-1#1';

    // The AICC data model
    var datamodel = {};
    for(defScoId in def){
        datamodel[defScoId] = {
            'cmi._children':{'defaultvalue':cmi_children, 'mod':'r', 'writeerror':'402'},
            'cmi._version':{'defaultvalue':'3.4', 'mod':'r', 'writeerror':'402'},
            'cmi.core._children':{'defaultvalue':core_children, 'mod':'r', 'writeerror':'402'},
            'cmi.core.student_id':{'defaultvalue':def[defScoId]['cmi.core.student_id'], 'mod':'r', 'writeerror':'403'},
            'cmi.core.student_name':{'defaultvalue':def[defScoId]['cmi.core.student_name'], 'mod':'r', 'writeerror':'403'},
            'cmi.core.lesson_location':{'defaultvalue':def[defScoId]['cmi.core.lesson_location'], 'format':CMIString256, 'mod':'rw', 'writeerror':'405'},
            'cmi.core.credit':{'defaultvalue':def[defScoId]['cmi.core.credit'], 'mod':'r', 'writeerror':'403'},
            'cmi.core.lesson_status':{'defaultvalue':def[defScoId]['cmi.core.lesson_status'], 'format':CMIStatus, 'mod':'rw', 'writeerror':'405'},
            'cmi.core.exit':{'defaultvalue':def[defScoId]['cmi.core.exit'], 'format':CMIExit, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.core.entry':{'defaultvalue':def[defScoId]['cmi.core.entry'], 'mod':'r', 'writeerror':'403'},
            'cmi.core.score._children':{'defaultvalue':score_children, 'mod':'r', 'writeerror':'402'},
            'cmi.core.score.raw':{'defaultvalue':def[defScoId]['cmi.core.score.raw'], 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.core.score.max':{'defaultvalue':def[defScoId]['cmi.core.score.max'], 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.core.score.min':{'defaultvalue':def[defScoId]['cmi.core.score.min'], 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.core.session_time':{'format':CMITimespan, 'mod':'w', 'defaultvalue':'00:00:00', 'readerror':'404', 'writeerror':'405'},
            'cmi.core.total_time':{'defaultvalue':def[defScoId]['cmi.core.total_time'], 'mod':'r', 'writeerror':'403'},
            'cmi.core.lesson_mode':{'defaultvalue':def[defScoId]['cmi.core.lesson_mode'], 'mod':'r', 'writeerror':'403'},
            'cmi.suspend_data':{'defaultvalue':def[defScoId]['cmi.suspend_data'], 'format':CMIString4096, 'mod':'rw', 'writeerror':'405'},
            'cmi.launch_data':{'defaultvalue':def[defScoId]['cmi.launch_data'], 'mod':'r', 'writeerror':'403'},
            'cmi.comments':{'defaultvalue':def[defScoId]['cmi.comments'], 'format':CMIString4096, 'mod':'rw', 'writeerror':'405'},
            // deprecated evaluation attributes
            'cmi.evaluation.comments._count':{'defaultvalue':'0', 'mod':'r', 'writeerror':'402'},
            'cmi.evaluation.comments._children':{'defaultvalue':comments_children, 'mod':'r', 'writeerror':'402'},
            'cmi.evaluation.comments.n.content':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIString256, 'mod':'rw', 'writeerror':'405'},
            'cmi.evaluation.comments.n.location':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIString256, 'mod':'rw', 'writeerror':'405'},
            'cmi.evaluation.comments.n.time':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMITime, 'mod':'rw', 'writeerror':'405'},
            'cmi.comments_from_lms':{'mod':'r', 'writeerror':'403'},
            'cmi.objectives._children':{'defaultvalue':objectives_children, 'mod':'r', 'writeerror':'402'},
            'cmi.objectives._count':{'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
            'cmi.objectives.n.id':{'pattern':CMIIndex, 'format':CMIIdentifier, 'mod':'rw', 'writeerror':'405'},
            'cmi.objectives.n.score._children':{'pattern':CMIIndex, 'mod':'r', 'writeerror':'402'},
            'cmi.objectives.n.score.raw':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.objectives.n.score.min':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.objectives.n.score.max':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.objectives.n.status':{'pattern':CMIIndex, 'format':CMIStatus2, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data._children':{'defaultvalue':student_data_children, 'mod':'r', 'writeerror':'402'},
            'cmi.student_data.attempt_number':{'defaultvalue':def[defScoId]['cmi.student_data.attempt_number'], 'mod':'r', 'writeerror':'402'},
            'cmi.student_data.tries.n.score.raw':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data.tries.n.score.min':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data.tries.n.score.max':{'defaultvalue':'', 'pattern':CMIIndex, 'format':CMIDecimal, 'range':score_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data.tries.n.status':{'pattern':CMIIndex, 'format':CMIStatus2, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data.tries.n.time':{'pattern':CMIIndex, 'format':CMITime, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_data.mastery_score':{'defaultvalue':def[defScoId]['cmi.student_data.mastery_score'], 'mod':'r', 'writeerror':'403'},
            'cmi.student_data.max_time_allowed':{'defaultvalue':def[defScoId]['cmi.student_data.max_time_allowed'], 'mod':'r', 'writeerror':'403'},
            'cmi.student_data.time_limit_action':{'defaultvalue':def[defScoId]['cmi.student_data.time_limit_action'], 'mod':'r', 'writeerror':'403'},
            'cmi.student_data.tries_during_lesson':{'defaultvalue':def[defScoId]['cmi.student_data.tries_during_lesson'], 'mod':'r', 'writeerror':'402'},
            'cmi.student_preference._children':{'defaultvalue':student_preference_children, 'mod':'r', 'writeerror':'402'},
            'cmi.student_preference.audio':{'defaultvalue':'0', 'format':CMISInteger, 'range':audio_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_preference.language':{'defaultvalue':'', 'format':CMIString256, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_preference.speed':{'defaultvalue':'0', 'format':CMISInteger, 'range':speed_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.student_preference.text':{'defaultvalue':'0', 'format':CMISInteger, 'range':text_range, 'mod':'rw', 'writeerror':'405'},
            'cmi.interactions._children':{'defaultvalue':interactions_children, 'mod':'r', 'writeerror':'402'},
            'cmi.interactions._count':{'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
            'cmi.interactions.n.id':{'pattern':CMIIndex, 'format':CMIIdentifier, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.objectives._count':{'pattern':CMIIndex, 'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
            'cmi.interactions.n.objectives.n.id':{'pattern':CMIIndex, 'format':CMIIdentifier, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.time':{'pattern':CMIIndex, 'format':CMITime, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.type':{'pattern':CMIIndex, 'format':CMIType, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.correct_responses._count':{'pattern':CMIIndex, 'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
            'cmi.interactions.n.correct_responses.n.pattern':{'pattern':CMIIndex, 'format':CMIFeedback, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.weighting':{'pattern':CMIIndex, 'format':CMIDecimal, 'range':weighting_range, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.student_response':{'pattern':CMIIndex, 'format':CMIFeedback, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.result':{'pattern':CMIIndex, 'format':CMIResult, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'cmi.interactions.n.latency':{'pattern':CMIIndex, 'format':CMITimespan, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
            'nav.event':{'defaultvalue':'', 'format':NAVEvent, 'mod':'w', 'readerror':'404', 'writeerror':'405'}
        };

        //alert('AICCapi end');
    }

    var cmi, nav, errorCode = "0";
    var currentStatus = "";
    var needRrefresh = false;

    function initdatamodel(scoid){
        //alert('initdatamodel scoid:'+scoid);
        //prerequrl = cfgwwwroot + "/mod/scorm/prereqs.php?a=" + scormid + "&scoid=" + scoid + "&attempt=" + attempt + "&mode=" + viewmode + "&currentorg=" + currentorg + "&sesskey=" + sesskey;
        //datamodelurlparams = "id=" + cmid + "&a=" + scormid + "&sesskey=" + sesskey + "&attempt=" + attempt + "&scoid=" + scoid;

        //
        // Datamodel inizialization
        //
        cmi = new Object();
        cmi.core = new Object();
        cmi.core.score = new Object();
        cmi.objectives = new Object();
        cmi.student_data = new Object();
        cmi.student_preference = new Object();
        cmi.interactions = new Object();
        // deprecated evaluation attributes
        cmi.evaluation = new Object();
        cmi.evaluation.comments = new Object();

        // Navigation Object
        nav = new Object();

        for (element in datamodel[scoid]) {
            if (element.match(/\.n\./) == null) {
                if ((typeof eval('datamodel["' + scoid + '"]["' + element + '"].defaultvalue')) != 'undefined') {
                    eval(element + ' = datamodel["' + scoid + '"]["' + element + '"].defaultvalue;');
                } else {
                    eval(element + ' = "";');
                }
            }
        }

        eval(cmiobj[scoid]);
        eval(cmiint[scoid]);

        //alert('initdatamodel cmi.core.lesson_status:'+cmi.core.lesson_status);
        if (cmi.core.lesson_status == '') {
            cmi.core.lesson_status = 'not attempted';
        }

        currentStatus = cmi.core.lesson_status;
    }

    //
    // API Methods definition
    //
    var Initialized = false;

    function LMSInitialize (param) {
        //alert('LMSInitialize param:'+param);
        //scoid = scorm_current_node ? scorm_current_node.scoid : scoid;
        //alert('LMSInitialize scoid:'+scoid);
        errorCode = "0";
        LogAPICall("LMSInitialize", "scoid", scoid, errorCode, "");
        initdatamodel(scoid);

        if (param == "") {
            if (!Initialized) {
                Initialized = true;
                errorCode = "0";
                if (scormdebugging) {
                    LogAPICall("LMSInitialize", "param", param, errorCode, "");
                }
                return "true";
            } else {
                errorCode = "101";
            }
        } else {
            errorCode = "201";
        }
        if (scormdebugging) {
            LogAPICall("LMSInitialize", "param", param, errorCode, "");
        }
        return "false";
    }

    function LMSFinish (param) {
        //alert('LMSFinish param:'+param);
        errorCode = "0";
        var result = "";
        if (param == "") {
            if (Initialized) {
                Initialized = false;
                result = StoreData(cmi,true);
                if (nav.event != '') {
                    //alert('nav.event:'+nav.event);
                    if (nav.event == 'continue') {
                        setTimeout('mod_scorm_launch_next_sco();',500);
                    } else {
                        setTimeout('mod_scorm_launch_prev_sco();',500);
                    }
                } else {
                    if (scormauto == 1) {
                        setTimeout('mod_scorm_launch_next_sco();',500);
                    }
                }

                result = ('true' == result) ? 'true' : 'false';
                errorCode = (result == 'true') ? '0' : '101';
                if (scormdebugging) {
                    LogAPICall("LMSFinish", "AJAXResult", result, "0", "");
                }
                // trigger TOC update
                if (needRrefresh) {
                    //alert('needRrefresh:'+needRrefresh);
                    needRrefresh = false;
                    mod_scorm_catalog_update();
                }

                return result;
            } else {
                errorCode = "301";
            }
        } else {
            errorCode = "201";
        }
        return "false";
    }

    function LMSGetValue (element) {
        //alert('LMSGetValue element:'+element);
        errorCode = "0";
        if (Initialized) {
            //alert('LMSGetValue Initialized');
            if (element != "") {
                expression = new RegExp(CMIIndex,'g');
                //alert('LMSGetValue expression:'+expression);
                elementmodel = String(element).replace(expression,'.n.');
                if ((typeof eval('datamodel["' + scoid + '"]["' + elementmodel + '"]')) != "undefined") {
                    if (eval('datamodel["' + scoid + '"]["' + elementmodel + '"].mod') != 'w') {
                            element = String(element).replace(expression, "_$1.");
                            elementIndexes = element.split('.');
                        subelement = 'cmi';
                        i = 1;
                        while ((i < elementIndexes.length) && (typeof eval(subelement) != "undefined")) {
                            subelement += '.' + elementIndexes[i++];
                        }
                        if (subelement == element) {
                            errorCode = "0";
                            if (scormdebugging) {
                                LogAPICall("LMSGetValue", element, eval(element), "0", "");
                            }
                            return eval(element);
                        } else {
                            errorCode = "0"; // Need to check if it is the right errorCode
                        }
                    } else {
                        errorCode = eval('datamodel["' + scoid + '"]["' + elementmodel + '"].readerror');
                    }
                } else {
                    childrenstr = '._children';
                    countstr = '._count';
                    if (elementmodel.substr(elementmodel.length - childrenstr.length,elementmodel.length) == childrenstr) {
                        parentmodel = elementmodel.substr(0,elementmodel.length - childrenstr.length);
                        if ((typeof eval('datamodel["' + scoid + '"]["' + parentmodel + '"]')) != "undefined") {
                            errorCode = "202";
                        } else {
                            errorCode = "201";
                        }
                    } else if (elementmodel.substr(elementmodel.length - countstr.length,elementmodel.length) == countstr) {
                        parentmodel = elementmodel.substr(0,elementmodel.length - countstr.length);
                        if ((typeof eval('datamodel["' + scoid + '"]["' + parentmodel + '"]')) != "undefined") {
                            errorCode = "203";
                        } else {
                            errorCode = "201";
                        }
                    } else {
                        errorCode = "201";
                    }
                }
            } else {
                errorCode = "201";
            }
        } else {
            errorCode = "301";
        }
        if (scormdebugging) {
            LogAPICall("LMSGetValue", element, "", errorCode, "");
        }
        return "";
    }

    function LMSSetValue (element,value) {
        //alert('LMSSetValue element:'+element+",value:"+value);
        errorCode = "0";
        if (Initialized) {
            if (element != "") {
                expression = new RegExp(CMIIndex,'g');
                elementmodel = String(element).replace(expression,'.n.');
                if ((typeof eval('datamodel["' + scoid + '"]["' + elementmodel + '"]')) != "undefined") {
                    if (eval('datamodel["' + scoid + '"]["' + elementmodel + '"].mod') != 'r') {
                        expression = new RegExp(eval('datamodel["' + scoid + '"]["' + elementmodel + '"].format'));
                        value = value + '';
                        matches = value.match(expression);
                        if (matches != null) {
                            //Create dynamic data model element
                            if (element != elementmodel) {
                                elementIndexes = element.split('.');
                                subelement = 'cmi';
                                for (i = 1; i < elementIndexes.length - 1; i++) {
                                    elementIndex = elementIndexes[i];
                                    if (elementIndexes[i + 1].match(/^\d+$/)) {
                                        if ((typeof eval(subelement + '.' + elementIndex)) == "undefined") {
                                            eval(subelement + '.' + elementIndex + ' = new Object();');
                                            eval(subelement + '.' + elementIndex + '._count = 0;');
                                        }
                                        if (elementIndexes[i + 1] == eval(subelement + '.' + elementIndex + '._count')) {
                                            eval(subelement + '.' + elementIndex + '._count++;');
                                        }
                                        if (elementIndexes[i + 1] > eval(subelement + '.' + elementIndex + '._count')) {
                                            errorCode = "201";
                                        }
                                        subelement = subelement.concat('.' + elementIndex + '_' + elementIndexes[i + 1]);
                                        i++;
                                    } else {
                                        subelement = subelement.concat('.' + elementIndex);
                                    }
                                    if ((typeof eval(subelement)) == "undefined") {
                                        eval(subelement + ' = new Object();');
                                        if (subelement.substr(0,14) == 'cmi.objectives') {
                                            eval(subelement + '.score = new Object();');
                                            eval(subelement + '.score._children = score_children;');
                                            eval(subelement + '.score.raw = "";');
                                            eval(subelement + '.score.min = "";');
                                            eval(subelement + '.score.max = "";');
                                        }
                                        if (subelement.substr(0,16) == 'cmi.interactions') {
                                            eval(subelement + '.objectives = new Object();');
                                            eval(subelement + '.objectives._count = 0;');
                                            eval(subelement + '.correct_responses = new Object();');
                                            eval(subelement + '.correct_responses._count = 0;');
                                        }
                                    }
                                }
                                element = subelement.concat('.' + elementIndexes[elementIndexes.length - 1]);
                            }
                            // Store data.
                            if (errorCode == "0") {
                                if (autocommit && !(AICCapi.timeout)) {
                                    //如果autocommit==true，则10秒后提交一次
                                    AICCapi.timeout = setTimeout("API.LMSCommit('')", 10000);
                                    // Executes the supplied function in the context of the supplied
                                    // object 'when' milliseconds later.  Executes the function a
                                    // single time unless periodic is set to true.
                                    //AICCapi.timeout = Y.later(60000, API, 'LMSCommit', [""], false);
                                }
                                if ((typeof eval('datamodel["' + scoid + '"]["' + elementmodel + '"].range')) != "undefined") {
                                    range = eval('datamodel["' + scoid + '"]["' + elementmodel + '"].range');
                                    ranges = range.split('#');
                                    value = value * 1.0;
                                    if ((value >= ranges[0]) && (value <= ranges[1])) {
                                        eval(element + '="' + value + '";');
                                        errorCode = "0";
                                        if (scormdebugging) {
                                            LogAPICall("LMSSetValue", element, value, errorCode, "");
                                        }
                                        return "true";
                                    } else {
                                        errorCode = eval('datamodel["' + scoid + '"]["' + elementmodel + '"].writeerror');
                                    }
                                } else {
                                    if (element == 'cmi.comments') {
                                        eval(element + '+="' + value + '";');
                                    } else {
                                        eval(element + '="' + value + '";');
                                    }
                                    errorCode = "0";
                                    if (scormdebugging) {
                                        LogAPICall("LMSSetValue", element, value, errorCode, "");
                                    }
                                    return "true";
                                }
                            }
                        } else {
                            errorCode = eval('datamodel["' + scoid + '"]["' + elementmodel + '"].writeerror');
                        }
                    } else {
                        errorCode = eval('datamodel["' + scoid + '"]["' + elementmodel + '"].writeerror');
                    }
                } else {
                    errorCode = "201"
                }
            } else {
                errorCode = "201";
            }
        } else {
            errorCode = "301";
        }
        if (scormdebugging) {
            LogAPICall("LMSSetValue", element, value, errorCode, "");
        }
        return "false";
    }

    function LMSCommit (param) {
        //alert('LMSCommit param:'+param);
        if (AICCapi.timeout) {
            //alert('AICCapi.timeout');
            //AICCapi.timeout.clear();
            AICCapi.timeout = null;
        }
        errorCode = "0";
        var result = "";
        if (param == "") {
            if (Initialized) {
                result = StoreData(cmi, false);
                // trigger TOC update
                if (needRrefresh) {
                    //alert('needRrefresh:'+needRrefresh);
                    needRrefresh = false;
                    mod_scorm_catalog_update();
                }

                result = ('true' == result) ? 'true' : 'false';
                errorCode = (result == 'true') ? '0' : '101';
                if (scormdebugging) {
                    LogAPICall("LMSCommit", "AJAXResult", result, errorCode, "");
                }
                return result;
            } else {
                errorCode = "301";
            }
        } else {
            errorCode = "201";
        }
        if (scormdebugging) {
            LogAPICall("LMSCommit", "param", param, "0", "");
        }
        return "false";
    }

    function LMSGetLastError () {
        //alert('LMSGetLastError errorCode:'+errorCode);
        if (errorCode != "0") {
            if (scormdebugging) {
                LogAPICall("LMSGetLastError", "", "", errorCode, "");
            }
        }
        return errorCode;
    }

    function LMSGetErrorString (param) {
        //alert('LMSGetErrorString param:'+param);
        if (param != "") {
            var errorString = new Array();
            errorString["0"] = "No error";
            errorString["101"] = "General exception";
            errorString["201"] = "Invalid argument error";
            errorString["202"] = "Element cannot have children";
            errorString["203"] = "Element not an array - cannot have count";
            errorString["301"] = "Not initialized";
            errorString["401"] = "Not implemented error";
            errorString["402"] = "Invalid set value, element is a keyword";
            errorString["403"] = "Element is read only";
            errorString["404"] = "Element is write only";
            errorString["405"] = "Incorrect data type";
            if (scormdebugging) {
                if (param != "0") {
                    LogAPICall("LMSGetErrorString", "param", param, param, errorString[param]);
                }
            }
            return errorString[param];
        }
        else {
        //     if (scormdebugging) {
        //          LogAPICall("LMSGetErrorString", param, "", "0", "No error string found!");
        //     }
           return "";
        }
    }

    function LMSGetDiagnostic (param) {
        //alert('LMSGetDiagnostic param:'+param);
        if (param == "") {
            param = errorCode;
        }
        if (scormdebugging) {
            LogAPICall("LMSGetDiagnostic", "param", param, param, "");
        }
        return param;
    }

    function formatDate(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
    
    function LogAPICall(msgType, param, paramValue, errorCode, errorMessage) {
        var dateObj = new Date();
        var message = formatDate(dateObj) + ": ";
        if (errorCode == "0") {
            message = msgType + " - OK: ";
        }
        else {
            message = msgType + " - Error: " + "errorCode:" + errorCode + ", ";

            if (errorMessage != "") {
                message += "errorMessage:" + errorMessage + ", ";
            }
        }

        if (param != "") {
            message += "param:" + param + ", ";
        }

        if (param != "") {
            message += "paramValue:" + paramValue + ", ";
        }

        message = message.substring(0, message.length - 2);
        
        console.log(message);
    }

    function AddTime (first, second) {
        //alert('AddTime first:'+first+',second:'+second);
        var sFirst = first.split(":");
        var sSecond = second.split(":");
        var cFirst = sFirst[2].split(".");
        var cSecond = sSecond[2].split(".");
        var change = 0;

        FirstCents = 0;  //Cents
        if (cFirst.length > 1) {
            FirstCents = parseInt(cFirst[1],10);
        }
        SecondCents = 0;
        if (cSecond.length > 1) {
            SecondCents = parseInt(cSecond[1],10);
        }
        var cents = FirstCents + SecondCents;
        change = Math.floor(cents / 100);
        cents = cents - (change * 100);
        if (Math.floor(cents) < 10) {
            cents = "0" + cents.toString();
        }

        var secs = parseInt(cFirst[0],10) + parseInt(cSecond[0],10) + change;  //Seconds
        change = Math.floor(secs / 60);
        secs = secs - (change * 60);
        if (Math.floor(secs) < 10) {
            secs = "0" + secs.toString();
        }

        mins = parseInt(sFirst[1],10) + parseInt(sSecond[1],10) + change;   //Minutes
        change = Math.floor(mins / 60);
        mins = mins - (change * 60);
        if (mins < 10) {
            mins = "0" + mins.toString();
        }

        hours = parseInt(sFirst[0],10) + parseInt(sSecond[0],10) + change;  //Hours
        if (hours < 10) {
            hours = "0" + hours.toString();
        }

        if (cents != '0') {
            return hours + ":" + mins + ":" + secs + '.' + cents;
        } else {
            return hours + ":" + mins + ":" + secs;
        }
    }

    var postData = {};
    var postDataCount = 0;
    
    function TotalTime() {
        //alert('TotalTime');
        var total_time = AddTime(cmi.core.total_time, cmi.core.session_time);
        var element = 'cmi.total_time';
        postData[underscore(element)] = encodeURIComponent(total_time);
        postDataCount = postDataCount + 1;
        //return '&' + underscore('cmi.core.total_time') + '=' + escape(total_time);
    }

    function underscore(str) {
        str = String(str).replace(/.N/g, ".");
        return str.replace(/\./g, "__");
    }

    function CollectData(data,parent) {
        //alert('CollectData data:'+data+'parent:'+parent);
        //var datastring = '';
        for (property in data) {
            if (typeof data[property] == 'object') {
                //datastring += CollectData(data[property],parent + '.' + property);
                CollectData(data[property],parent + '.' + property);
            } else {
                element = parent + '.' + property;
                expression = new RegExp(CMIIndex,'g');
                elementmodel = String(element).replace(expression,'.n.');
                if ((typeof eval('datamodel["' + scoid + '"]["' + elementmodel + '"]')) != "undefined") {
                    if (eval('datamodel["' + scoid + '"]["' + elementmodel + '"].mod') != 'r') {
                        //elementstring = '&' + underscore(element) + '=' + escape(data[property]);
                        if ((typeof eval('datamodel["' + scoid + '"]["' + elementmodel + '"].defaultvalue')) != "undefined") {
                            if (eval('datamodel["' + scoid + '"]["' + elementmodel + '"].defaultvalue') != data[property]) {
                                //datastring += elementstring;
                                postData[underscore(element)] = encodeURIComponent(data[property]);
                                postDataCount = postDataCount + 1;
                            }
                        } else {
                            //datastring += elementstring;
                            postData[underscore(element)] = encodeURIComponent(data[property]);
                            postDataCount = postDataCount + 1;
                        }
                    }
                }
            }
        }
        //return datastring;
    }

    function StoreData(data,storetotaltime) {
        //alert("StoreData data:"+data+"storetotaltime:"+storetotaltime);
        postData = {};
        postDataCount = 0;
        if (storetotaltime) {
            if (cmi.core.lesson_mode == 'normal') {
                if (cmi.core.credit == 'credit') {
                    if (cmi.student_data.mastery_score != '' && cmi.core.score.raw != '') {
                        if (cmi.core.score.raw >= cmi.student_data.mastery_score) {
                            cmi.core.lesson_status = 'passed';
                        } else {
                            cmi.core.lesson_status = 'failed';
                        }
                    }
                }
            }
            if (cmi.core.lesson_mode == 'browse') {
                if (datamodel[scoid]['cmi.core.lesson_status'].defaultvalue == '' && cmi.core.lesson_status == 'not attempted') {
                    cmi.core.lesson_status = 'browsed';
                }
            }
            //datastring = CollectData(data,'cmi');
            //datastring += TotalTime();
            CollectData(data, 'cmi');
            TotalTime();
        } else {
            //datastring = CollectData(data,'cmi');
            CollectData(data, 'cmi');
        }


        if (VIEWMODE == "normal" && courseRegId != "" && postDataCount > 0) {
            //alert("StoreData datastring:" + datastring);
            //var newRecordUrl  = recordUrl + datastring;
            //
            ////alert(recordUrl);
            //ajaxData(newRecordUrl,
            //    "POST",
            //    {},
            //var parts = datastring.split("&");
            //var params = {};
            //for(var i = 0; i < parts.length; i ++){
            //    if (parts[i] == ""){
            //        /**/
            //    }else {
            //        var kv = parts[i].split("=");
            //        params[kv[0]] = kv[1];
            //    }
            //}
            //alert(recordUrl);
            ajaxData(recordUrl,
                "POST",
                postData,
                "json",
                function(data){
                    result = data.result;
                    errorCode = data.message;
                    request = data.request;
                    //alert(request);
                    //alert(result);
                    //alert(errorCode);
                    //alert("currentStatus:"+currentStatus+",cmi.core.lesson_status:"+cmi.core.lesson_status);
                    if (currentStatus !=  cmi.core.lesson_status)
                    {
                        currentStatus = cmi.core.lesson_status;
                        needRrefresh  = true;
                    }
                    try {scorePointEffect(data.pointResult.show_point,data.pointResult.point_name,data.pointResult.available_point);}catch(e) {}
                }
            );
        }
        return result;
    }

    this.LMSInitialize = LMSInitialize;
    this.LMSFinish = LMSFinish;
    this.LMSGetValue = LMSGetValue;
    this.LMSSetValue = LMSSetValue;
    this.LMSCommit = LMSCommit;
    this.LMSGetLastError = LMSGetLastError;
    this.LMSGetErrorString = LMSGetErrorString;
    this.LMSGetDiagnostic = LMSGetDiagnostic;
}

function scorm_api_init(courseRegId,courseCompleteProcessId,courseCompleteFinalId,def, cmiobj, cmiint, cmicommentsuser, cmicommentslms, cmistring256, cmistring4096, scormdebugging, scormauto, scormid, recordUrl, sessionKey, scoid, attempt, viewmode, modResId, currentorg, autocommit) {
    //alert('scorm_api_init');
    //alert("courseRegId:"+courseRegId);
    //alert("courseCompleteProcessId:"+courseCompleteProcessId);
    //alert("courseCompleteFinalId:"+courseCompleteFinalId);
    //alert("def:"+def);
    //alert("cmiobj:"+cmiobj);
    //alert("cmiint:"+cmiint);
    //alert("cmicommentsuser:"+cmicommentsuser);
    //alert("cmistring256:"+cmistring256);
    //alert("cmistring4096:"+cmistring4096);
    //alert("scormdebugging:"+scormdebugging);
    //alert("scormauto:"+scormauto);
    //alert("scormid:"+scormid);
    //alert("recordUrl:"+recordUrl);
    //alert("sesskey:"+sesskey);
    //alert("scoid:"+scoid);
    //alert("attempt:"+attempt);
    //alert("viewmode:"+viewmode);
    //alert("modResId:"+modResId);
    //alert("currentorg:"+currentorg);
    //alert("autocommit:"+autocommit);
    window.API = new AICCapi(courseRegId,courseCompleteProcessId,courseCompleteFinalId,def, cmiobj, cmiint, cmicommentsuser, cmicommentslms, cmistring256, cmistring4096, scormdebugging, scormauto, scormid, recordUrl, sessionKey, scoid, attempt, viewmode, modResId, currentorg, autocommit);
}
