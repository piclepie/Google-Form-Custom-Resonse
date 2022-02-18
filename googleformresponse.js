//install the trigger  onFOrmSubmit. Then it should be good to go.
function onFormSubmit(e) {
    const form = FormApp.getActiveForm();
    const items = form.getItems();
    const formResponses = e.response;
    const arr = [];
    let receiptant_name;
    for (i in items) {
      let each_response = formResponses.getResponseForItem(items[i]).getResponse();
      //this coulumn has the supervisor name,  You can change column title into yours.
      if (items[i].getTitle() == 'Supervisor Name') {
        //return a list of name
        receiptant_name = each_response;
      }
      if(typeof(each_response) == "object"){
        each_response ='<div>' + each_response.map(r => { return '<div>'+r+'</div>';}).join('') + '</div>';
      }
      const title = items[i].getTitle();
      arr.push([title, each_response]);
    }
    const emailbody = return_emailbody(arr);
    const receiptant_email = return_supv_email(receiptant_name);
    sendEmail(receiptant_email, emailbody);
  }
  
  //this function to map form responses into html table.
  function return_emailbody(responsearray) {
    let mail_array = [];  
    responsearray.forEach(r => {
      if (r[1] === null || r[1] === '') {
        r[1] = 'N/A';
      }
      mail_array.push('<tr><td>' + r[1] + '</td></tr>')
    });
    const completed_template = htmltemplate(mail_array.join(''));
    return completed_template;
  }
  
  
  //sheet id contains the supervisor email.Default Sheet1, you can change to your sheet name.
  function return_supv_email(sheetid,supv_name) {
    //receive name list
    const values = sheet_data_return(sheetid, 'Sheet1');
    let email_list = [];
    for(i in supv_name){
      values.filter(record => {
        if (record[1].replace(/\s/g, '').includes(supv_name[i].replace(/\s/g, ''))) {
          email_list.push (record[2]);
        }
      });
    }
     return email_list.toString();
  }
  
  
  function sheet_data_return(id, sheet_Name) {
    return SpreadsheetApp.openById(id).getSheetByName(sheet_Name).getDataRange().getDisplayValues();
  }
  
  function sendEmail(recipient, emailbody) {
    GmailApp.sendEmail(
      recipient,
      'FORM GOT A NEW RESPONSE',
      emailbody,
      {
        htmlBody: emailbody,
        name: 'GOOGLE FORM RESPONSE',
      });
  
  }
  
  function htmltemplate(emailbody) {
    let template = '<!DOCTYPE html> <html> <head> <base target="_top"> </head><body><table></table> </body> </html>';
    template = template.replace('{body}', emailbody);
    return template;
  }
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
