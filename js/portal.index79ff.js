
var timeLineListTable = new clientTable('timeLine_list');
timeLineListTable.singlePage = true;
timeLineListTable.lineTemplate = function (val) {
    var $line = $('<tr data-id="' + val.id + '"/>');

    $line.append(
        '<td>' + val.created_at_text + '</td>' +
        '<td>' + val.statement + '</td>' +
        '<td class="text-muted">' + val.comments + '</td>' +
        '<td><strong>' + val.user_name + '</strong></td>'
    );

    return $line;
};
var progressListTable = new clientTable('progress_list');
progressListTable.singlePage = true;
progressListTable.lineTemplate = function (val) {
    var $line = $('<tr data-id="' + val.id + '"/>');
	if (val.header == true){
		$line.append(
		    '<td class="bureau-header" colspan="3"><h3>' + val.title + '</h3></td>' +
		    '<td class="bureau-header"><h3><strong>' + val.counter + '</strong></h3></td>'
		);
	}else{
		$line.append(
		    '<td>' + val.title + '</td>' +
		    '<td>' + val.initial_score + '</td>'+
		    '<td>' + val.current_score + '</td>'+
		    '<td>&nbsp;</td>'
		);
	}
    

    return $line;
};

var portalCore = {
    start: function (){

    },

    alert: function (type, message, title) {
        if (message || title) {
            $.notify({message: message, title:title}, {type: type, z_index: 1090});
        }
    },

    updateTimeLineList: function () {
        timeLineListTable.get(1, true);
    },
	updateProgressList: function () {
	    progressListTable.get(1, true);
	},
};




/*--------------------------------------------------------------------------------------------------------------------*/


jQuery(function($) {
    $('[data-toggle="tooltip"]').tooltip();

    $.ajaxSetup({
        headers: {
            'X-XSRF-TOKEN': window.Laravel.csrfToken
        }
    });

    $('body').on('click', 'a.fullText-a', function () {
        $('#modal-fullText-body').empty().html($(this).parent().find('div.fullText-div').html());

        $('#modal-fullText').modal('show');

        $(this).blur();

        return false;
    });

    $('#modal-fullText').modal({
        show: false
    }).on('hide.bs.modal', function () {
        $('#modal-fullText-body').empty();
    });



    $('#modal-timeLine').on('show.bs.modal', function (e) {
        $('#modal-timeLine-form').find('input[type="text"],textarea').val('').filter('[name="tell_attorney_text"],[name="tell_advocate_text"]').prop('required', null).hide();
        $('#modal-timeLine-form').find('input[type="checkbox"]').prop('checked', null);

        if ($('#client-fields select[name="sales_id"]').val()) {
            $('#tell_sales_div').show();
        } else {
            $('#tell_sales_div').hide();
        }

        if ($('#client-fields select[name="attorney_id"]').val()) {
            $('#tell_attorney_div').show();
        } else {
            $('#tell_attorney_div').hide();
        }
    });

   
    $('#action_list-body, #timeLine_list-body').on('click', 'td.action-description.action-fulltext', function () {
        var $textArea = $(this).parent().find('textarea');
        var $text = $(this).find('div');

        $text.hide();

        $textArea.off('blur').on('blur', function () {
            $textArea.hide();
            $text.show();
        });

        $textArea.show();
        $textArea.focus().scrollTop(0);
    });

    timeLineListTable.start();
    progressListTable.start();
});

