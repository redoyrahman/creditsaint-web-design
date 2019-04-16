jQuery(function ($) {
    var $form = $('#gs-form');

    $('#f_phone').mask('+1(000)000-0000', {placeholder: "+1(___)___-____"});
    $('#f_social_number').mask('000-00-0000', {placeholder: "___-__-____"});
	$('#f_spouse_social_number').mask('000-00-0000', {placeholder: "___-__-____"});
    $('#f_zip,#billing_zip').mask('00000', {placeholder: "_____"});
    $('#f_card_number').mask('0000-0000-0000-0000', {placeholder: "____-____-____-____"});
    $('#f_card_code').mask('0000', {placeholder: "___"});

    $('#f_birth_date').daterangepicker({
        ranges: {},
        singleDatePicker: true,
        linkedCalendars: false,
        autoApply: true,
        autoUpdateInput: false,
        showDropdowns: true,
        startDate: moment().subtract(16, 'years'),
        endDate: moment().subtract(100, 'years'),
        opens: "right",
        drops: "down",
        locale: {
            format: window.Laravel.localeFormatDate
        }
    }, function (start) {
        $('#f_birth_date').val(start.format(window.Laravel.localeFormatDate));
    });
	$('#f_spouse_birth_date').daterangepicker({
	    ranges: {},
	    singleDatePicker: true,
	    linkedCalendars: false,
	    autoApply: true,
	    autoUpdateInput: false,
	    showDropdowns: true,
	    startDate: moment().subtract(16, 'years'),
	    endDate: moment().subtract(100, 'years'),
	    opens: "right",
	    drops: "down",
	    locale: {
	        format: window.Laravel.localeFormatDate
	    }
	}, function (start) {
	    $('#f_spouse_birth_date').val(start.format(window.Laravel.localeFormatDate));
	});

    $form.find('.custom-radio .custom-control-input[name="program_id"]').on('click', function () {
        updatePrice();

        $('#gs-send').show();

        $('html, body').animate({
            scrollTop: $("#gs-programs-details").offset().top
        }, 1000);
    });
	$form.find('.custom-radio .custom-control-input[name="spouse_program_id"]').on('click', function () {
	     updatePrice();
	
	});

    $('#gs-send').on('click', function () {
        var error = false;
        var $firstErrorField = null;

        $form.find('.form-group').removeClass('has-danger has-success');
        $form.find('.form-control').removeClass('form-control-danger form-control-success');
        $form.find('.form-control-feedback').addClass('hidden');

        $.each($form.find('.form-control'), function () {
            var $group = $(this).closest('.form-group').first();
            var $fieldFeedback = $group.find('.form-control-feedback');
            var check = false;

            if ($(this).val()) {
                switch ($(this).attr('name')) {
                    case 'password_confirmation':
                    case 'spouse_password_confirmation':
                        if ($(this).val().length >= 8 && $form.find('input[name="' + ($(this).attr('name').replace('_confirmation', '')) + '"]').val() == $(this).val()) {
                            check = true;
                        }
                        break;
                    case 'password':
                    case 'spouse_password':
                        if ($(this).val().length >= 8) {
                            check = true;
                        }
                        break;
                    case 'spouse_username':
                        if (/^([a-zA-Z0-9_\@.!-]){4,}$/.test($(this).val())) {
                            if ($form.find('input[name="username"]').val() != $(this).val()) {
                                check = true;
                            } else {
                                alert('User ID and Spouse’s User ID must be different');
                            }
                        }
                        break;
                    case 'username':
                        if (/^([a-zA-Z0-9_\@.!-]){4,}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'address':
                    case 'billing_address':
                    case 'address_apt':
                    case 'billing_city':
                    case 'city':
                        if (/^([a-zA-Z0-9_.,:+-\/\\ ]){2,}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'social_number':
					case 'spouse_social_number':
                        if (/^([0-9]){3}\-([0-9]){2}\-([0-9]){4}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'zip':
                    case 'billing_zip':
                        if (/^([0-9]){5}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'first_name':
                    case 'last_name':
                        if (/^([a-zA-Z., -]){2,}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'email':
                        if (/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,8})+$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    case 'card_number':
                        if (/^([0-9]){4}\-([0-9]){4}\-([0-9]){4}\-([0-9]){4}$/.test($(this).val())) {
                            check = true;
                        }
						if (/^([0-9]){4}\-([0-9]){4}\-([0-9]){4}\-([0-9]){3}$/.test($(this).val())) {
						    check = true;
						}
                        break;
                    case 'card_code':
                        if (/^([0-9]){3,}$/.test($(this).val())) {
                            check = true;
                        }
                        break;
                    default:
                        check = true;
                        break;
                }
            }

            if (check) {
                $group.addClass('has-success');
                $(this).addClass('form-control-success');
            } else if ($(this).prop('required')) {
                $group.addClass('has-danger');
                $(this).addClass('form-control-danger');
                $fieldFeedback.removeClass('hidden');

                if (!$firstErrorField) {
                    $firstErrorField = $group
                }

                error = true;
            }
        });

        if (error) {
            $('html, body').animate({
                scrollTop: $firstErrorField.offset().top - 50
            }, 1000);

            return false;
        } else {
            $(this).text('Please, wait...').attr('disabled', 'disabled');

             $form.submit();
                   
            
        }
    });
	$('#f_billing_address').keyup(function(){
		$('#address_validate').val('0');
	});
	$('#f_billing_city').keyup(function(){
		$('#address_validate').val('0');
	});
	$('#f_billing_state').change(function(){
		$('#address_validate').val('0');
	});
	$('#f_billing_zip').keyup(function(){
		$('#address_validate').val('0');
	});
	
	$('.gs-program-table .choose-program').each(function(){
		$(this).mouseover(function(){
			var selected = this;
			$('.gs-program-table .choose-program').each(function(){
				if ($(this).attr('data-program') == $(selected).attr('data-program')){
					$(this).addClass('hover');
				}else{
					$(this).removeClass('hover');
				}
			});
			
		});
		$(this).click(function(){
			var selected = this;
			$('#program-selector .custom-control-input').each(function(){
				if ($(this).val() == $(selected).attr('data-program')){
					$(this).prop('checked', true);
					
					updatePrice();
					
			        $('#gs-send').show();
			
			        $('html, body').animate({
			            scrollTop: $("#gs-programs-details").offset().top
			        }, 2000);
					
				}else{
					$(this).prop('checked', false);
				}
			});
		});
	});
	
	$('#spouse-checkbox').click(function(){
		$(this).toggleClass('selected');
		$('#spouse-program').slideToggle();
		$('#spouse-program .custom-control-input').each(function(){
			$(this).prop('checked', false);
		});
	});
	
	$('#agreement-list input[type="checkbox"],#f_ssn_approve').each( function () {
	        
		if ($('#agreement-list input[type="checkbox"],#f_ssn_approve').not(':checked').length){
			$('#gs-send').prop('disabled', true);
			$('.step5-require').removeClass('hidden');
		}else{
			$('#gs-send').prop('disabled', null);
			$('.step5-require').addClass('hidden');
		}
				       
	});	

    $('#agreement-list input[type="checkbox"],#f_ssn_approve').on('click', function () {
        
		if ($('#agreement-list input[type="checkbox"],#f_ssn_approve').not(':checked').length){
			$('#gs-send').prop('disabled', true);
			$('.step5-require').removeClass('hidden');
		}else{
			$('#gs-send').prop('disabled', null);
			$('.step5-require').addClass('hidden');
		}
		

        $(this).blur();
    });

    setInterval(function () {
        $.get('/updateSession.json');
    }, 30 * 1000);


    $('#spouse_same_address,#billing_same_address').on('click', function () {
        if ($(this).is(':checked')) {
            $.each($form.find('input.base-value,select.base-value'), function () {
                $(this).val($(this).attr('data-base-value'));
            });
        } else {
            $.each($form.find('input.base-value,select.base-value'), function () {
                $(this).val('');
            });
        }

        $(this).blur();
    });
	$('#showcoupon').click(function(){
		$('#coupon-box').slideToggle();
	});
    $('#button_check_coupon').on('click', function () {
        var $field = $('#f_coupon');
        var this_ = this;

        if ($field.val()) {
            $.ajax({
                url: $(this_).attr('data-checkCoupon'),
                data: {code: $field.val(), _token: window.Laravel.csrfToken},
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        $field.closest('.form-group').first().addClass('has-success');
                        $field.addClass('form-control-success');
                        $field.prop('readonly', 'readonly');
						$('#total_initial').html(data.coupon.initial_fee);
						$('#total_monthly').html(data.coupon.monthly_fee);
                        $(this_).fadeOut(function () {
                            $(this).remove();
                        });
                    } else {
                        alert('Incorrect Code or invalid Coupon');
                    }
                }
            });
        }
    });

    switch ($form.attr('data-step')) {
        case '1':
            $('#gs-send').removeClass('hidden');
            break;
        case '2':
            break;
        case '3':
            $('#gs-send').removeClass('hidden');
            break;
        case '4':
            $('#gs-send').removeClass('hidden');
			break;
        case '5':
            
			$('#gs-send').removeClass('hidden').prop('disabled', 'disabled');
            break;
    }
});

function updatePrice(){
	$('#gs-programs-details').removeClass('hidden');
	var initial_fee = 0;
	var monthly_fee = 0;
	$('.gs-program-table .custom-control-input').each(function(){
		
		if ($(this).prop('checked') == true){
			initial_fee = $(this).attr('data-initial-fee');
			monthly_fee = $(this).attr('data-monthly-fee');
		}
	});
	$('#spouse-program .custom-control-input').each(function(){
		
		if ($(this).prop('checked') == true){
			
			monthly_fee = (parseFloat(monthly_fee) + parseFloat($(this).attr('data-monthly-fee'))).toFixed(2);
		}
	});
	$('#total_initial').html('$'+initial_fee);
	$('#total_monthly').html('$'+monthly_fee);
}
