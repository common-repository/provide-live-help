Ext.ux.LiveSupportAdminApp = function(){
  
  var ssl_domain          = 'ssl7.net';
  var web_product_domain  = 'providelivehelp.com';
  var web_product_name    = 'Provide Live Help';
  
  var proto = ("https:" == document.location.protocol) ? "https" : "http";
  
  var widget_re = new RegExp(web_product_name.toLowerCase().replace(/[\.,\s]/g,'-'));
  
  Ext.BLANK_IMAGE_URL = proto + '://static.ssl7.net/extjs/lib/resources/images/default/s.gif';

  Ext.QuickTips.init();

  var dom_culture = 'en';
  var dom_align = 'center';
  var dom_html_code = '';
  var dom_vt_code = '';
  
  Ext.select('.widget').each(function(widget){
    
    if (widget.dom.id.match(widget_re))
    {
      dom_align = widget.child('input[name=websitechat_align]').dom.value;
      dom_culture = widget.child('input[name=websitechat_culture]').dom.value;
      
      widget.child('input[name=savewidget]').hide();
      
      if (widget.child('textarea[name=websitechat_button]').dom.value)
      {
        dom_html_code = widget.child('textarea[name=websitechat_button]').dom.value;
      }
      
      if (widget.child('textarea[name=websitechat_vt]').dom.value)
      {
        dom_vt_code = widget.child('textarea[name=websitechat_vt]').dom.value;
      }
    }
  });
  
  var cultureStore = new Ext.data.SimpleStore({
    id: 0,
    fields: [
      'culture',
      'name'
    ]
  });

  var languagesCombo = new Ext.form.ComboBox({
    store: cultureStore,
    displayField: 'name',
    valueField: 'culture',
    width: 140,
    listWidth: 140,
    name: 'culture',
    hiddenName: 'culture',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    hidden: true,
    listeners: {
      select: function(combo,r){
        
        var re = new RegExp("\/"+dom_culture+"\/", "g");
        
        var new_code = dom_html_code.replace(re,"/"+r.data.culture+"/");

        Ext.select('.x-websitechat_preview').update(new_code);
        advHtmlCode.setValue(new_code);
        
        buttonsList.renderButtons(r.data.culture);
        
        dom_culture = r.data.culture;
        dom_html_code = new_code;
      }
    }
  });

  var alignCombo = new Ext.form.ComboBox({
    store: new Ext.data.SimpleStore({
      id: 0,
      fields: ['name'],
      data: [[ "left" ],["center"],["right"]]
    }),
    displayField: 'name',
    valueField: 'name',
    value: dom_align,
    width: 80,
    listWidth: 80,
    name: 'align',
    hiddenName: 'align',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    hidden: true,
    listeners: {
      select: function(combo,r){
        var widgets = Ext.select('.widget')
        
        widgets.each(function(widget){
          
          if (widget.dom.id.match(widget_re))
          {
            widget.child('input[name=websitechat_align]').dom.value = r.data.name;
          }
          
        });
        
        Ext.select('.x-websitechat_preview').setStyle('text-align',r.data.name);
      }
    }
  });
  
  var buttonsList = new Ext.Panel({
    height: 433,
    autoScroll: true,
    renderButtons: function(culture){
      
      buttonsList.removeAll();
      
      buttonStore.each(function(r){
        
        var button = r.data;
        
        var on_img = button.on_img.replace(/%CULTURE%/g,culture);
        var off_img = button.off_img.replace(/%CULTURE%/g,culture);
        var html_code = button.html_code.replace(/%CULTURE%/g,culture);
        
        if (proto == 'https')
        {
          on_img = on_img.replace(/http\:/g,'https:');
          off_img = off_img.replace(/http\:/g,'https:');
          html_code = html_code.replace(/http\:/g,'https:');
        }
        
        var tick = '';
        
        var html_match = html_code.match(/\/[a-z,0-9]+\.gif/);
        var dom_html_match = dom_html_code.match(/\/[a-z,0-9]+\.gif/);
        
        if (html_match && dom_html_match && (html_match[0] == dom_html_match[0]))
        {
          tick = '<img src="'+proto+'://static.ssl7.net/images/tick.gif" alt="V" />';
        }
        
        buttonsList.add({
          id: 'button-' + button.id,
          border: false,
          htmlCode: html_code,
          style: 'margin-left: 20px; margin-top: 20px; cursor: pointer;',
          defaults: { border: false },
          layout: 'column',
          items: [
            {
              columnWidth: .5,
              defaults: { border: false },
              items: [
                {
                  html: 'Online button',
                  style: 'margin-bottom: 5px;'
                },{
                  html: on_img
                }
              ]
            },{
              columnWidth: .5,
              defaults: { border: false },
              items: [
                {
                  html: 'Offline button',
                  style: 'margin-bottom: 5px;'
                },{
                  html: off_img
                }
              ]
            },{
              width: 40,
              cls: 'x-btn-tick',
              style: 'margin-top: 20px;',
              html: tick
            }
          ],
          listeners: {
            render: function(panel){
              panel.body.on('click',function(){
                
                Ext.fly(panel.getEl()).frame("ff0000");
                
                buttonsList.items.each(function(btnPanel){
                  btnPanel.items.items[2].body.update('');
                });
                
                panel.items.items[2].body.update('<img src="'+proto+'://static.ssl7.net/images/tick.gif" alt="V" />');
                
                var widgets = Ext.select('.widget')
                
                widgets.each(function(widget){
                  
                  if (widget.dom.id.match(widget_re))
                  {
                    widget.child('input[name=websitechat_align]').dom.value = alignCombo.getValue();
                    widget.child('input[name=websitechat_culture]').dom.value = languagesCombo.getValue();
                    widget.child('textarea[name=websitechat_button]').dom.value = html_code;
                  }
                  
                });
                
                dom_html_code = html_code;
                
                Ext.select('.x-websitechat_preview').update(html_code);
                advHtmlCode.setValue(html_code);
              });
            }
          }
        });
      });
      
      buttonsList.doLayout();
    }
  });

  var advHtmlCode = new Ext.form.TextArea({
    height: 80,
    width: 450,
    value: dom_html_code
  });
  
  var vt_disabled_checked = false;
  var vt_enabled_checked = false;
  
  if (dom_vt_code)
  {
    var vt_enabled_checked = true;
  }
  else
  {
    var vt_disabled_checked = true;
  }
  
  var advancedWrapper = new Ext.Panel({
    bodyStyle: 'padding: 5px;',
    layout: 'table',
    layoutConfig: { columns: 2 },
    border: true,
    defaults: { border: false, bodyStyle: 'font: normal 11px tahoma,arial,verdana,sans-serif;' },
    height: 100,
    items: [
      {
        width: 480,
        bodyStyle: 'font: bold 11px tahoma,arial,verdana,sans-serif; color: #15428B;',
        html: 'Chat Button HTML code'
      },{
        width: 110,
        bodyStyle: 'font: bold 11px tahoma,arial,verdana,sans-serif; color: #15428B;',
        html: 'Visitors Tracking'
      },
        advHtmlCode,
      {
        items: [
          {
            xtype: 'radio',
            name: 'vt',
            boxLabel: 'Disabled',
            checked: vt_disabled_checked,
            listeners: {
              check: function(box,state){
                if (!state) return;
                
                var widgets = Ext.select('.widget')
                
                widgets.each(function(widget){
                  
                  if (widget.dom.id.match(widget_re))
                  {
                    widget.child('textarea[name=websitechat_vt]').dom.value = '';
                  }
                  
                });
              }
            }
          },{
            xtype: 'radio',
            name: 'vt',
            boxLabel: 'Enabled',
            checked: vt_enabled_checked,
            listeners: {
              check: function(box,state){
                if (!state) return;
                
                var vt_code = '';
                
                vtStore.each(function(r){
                  if (r.data.main_url.match(/http:\/\/(.*)\//)[1] == document.domain)
                  {
                    vt_code = '<!-- '+web_product_name+' tracking BEGIN -->';
                    vt_code+= '<script type="text/javascript">';
                    vt_code+= 'var xCtD = new Date(); var xCtURL = (("https:" == document.location.protocol) ? "https://'+ssl_domain+'/" : "http://'+ssl_domain+'/");';
                    vt_code+= 'document.write(unescape("%3Cscript src=\'" + xCtURL + "chat/b/'+r.data.enc_id+'.js?dc=" + xCtD.getTime() + "\' type=\'text/javascript\'%3E%3C/script%3E"));';
                    vt_code+= '</script>';
                    vt_code+= '<!-- '+web_product_name+' tracking END -->';
                    
                    return false;
                  }
                  
                });
                
                if (!vt_code)
                {
                  var waitWin = Ext.Msg.wait('Enabling Visitors Tracking','Please wait...');
                  
                  var site_url = proto+'://'+document.domain+'/';
                  
                  var vtAddStore = new Ext.data.JsonStore({
                    baseParams: { method: 'visitortracking-add', name: 'Wordpress', main_url: site_url },
                    proxy: new Ext.data.ScriptTagProxy({
                      url: 'https://'+ssl_domain+'/'+web_product_domain+'/api'
                    })
                  });
                  
                  vtAddStore.load({callback: function(){
                    
                    waitWin.hide();
                    
                    if (!vtAddStore.reader.jsonData.success)
                    {
                      Ext.Msg.show({
                        title: 'Error',
                        msg: 'Request faield',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        minWidth: 300
                      });
                      
                      return false;
                    }
                    
                    vt_code = '<!-- '+web_product_name+' tracking BEGIN -->';
                    vt_code+= '<script type="text/javascript">';
                    vt_code+= 'var xCtD = new Date(); var xCtURL = (("https:" == document.location.protocol) ? "https://'+ssl_domain+'/" : "http://'+ssl_domain+'/");';
                    vt_code+= 'document.write(unescape("%3Cscript src=\'" + xCtURL + "chat/b/'+vtAddStore.reader.jsonData.enc_site_id+'.js?dc=" + xCtD.getTime() + "\' type=\'text/javascript\'%3E%3C/script%3E"));';
                    vt_code+= '</script>';
                    vt_code+= '<!-- '+web_product_name+' tracking END -->';
                    
                    var widgets = Ext.select('.widget')
                    
                    widgets.each(function(widget){
                      
                      if (widget.dom.id.match(widget_re))
                      {
                        widget.child('textarea[name=websitechat_vt]').dom.value = vt_code;
                      }
                      
                    });
                    
                  }});
                  
                }
                else
                {
                  var widgets = Ext.select('.widget')
                  
                  widgets.each(function(widget){
                    
                    if (widget.dom.id.match(widget_re))
                    {
                      widget.child('textarea[name=websitechat_vt]').dom.value = vt_code;
                    }
                    
                  });
                }
                
              }
            }
          }
        ]
      }
    ]
  });

  var advancedPanel = new Ext.Panel({
    hidden: true,
    height: 110,
    bodyStyle: 'padding: 5px;',
    items: advancedWrapper
  });

  var buttonsPanel = {
    border: false,
    defaults: { border: false },
    items: [
      {
        bodyStyle: 'font-size: 14px; font-weight: bold; padding: 20px;',
        style: 'margin-bottom: 10px;',
        html: 'Please select your Live Chat button'
      },
        buttonsList,
        advancedPanel
    ]
  }

  var buttonStore = new Ext.data.JsonStore({
    baseParams: { method: 'buttons' },
    proxy: new Ext.data.ScriptTagProxy({
      url: 'https://'+ssl_domain+'/'+web_product_domain+'/api'
    })
  });
  
  var vtStore = new Ext.data.JsonStore({
    baseParams: { method: 'visitortracking-list' },
    proxy: new Ext.data.ScriptTagProxy({
      url: 'https://'+ssl_domain+'/'+web_product_domain+'/api'
    })
  });

  var loginForm = {
    doSubmit: function(){
      
      var errors = false;
      
      var email = Ext.getCmp('email').getValue();
      
      if (!email)
      {
        Ext.getCmp('email').markInvalid('This field is required.');
        errors = true;
      }
      
      var password = Ext.getCmp('password').getValue();
      
      if (!password)
      {
        Ext.getCmp('password').markInvalid('This field is required.');
        errors = true;
      }
      
      if (errors) return false;
      
      buttonStore.baseParams = { method: 'buttons', email: email, password: password };
      
      buttonStore.load({callback: function(){
        
        if (buttonStore.reader.jsonData.status == "200")
        {
          win.showBBar();
          buttonsList.renderButtons(languagesCombo.getValue());
          
          wrapper.removeAll();
          wrapper.add(buttonsPanel);
          wrapper.doLayout();
        }
        else
        {
          Ext.getCmp('email').reset();
          Ext.getCmp('password').reset();
          
          Ext.getCmp('login-error').body.update(buttonStore.reader.jsonData.errors);
        }
      }});
    },
    border: false,
    defaults: { border: false, allowBlank: false, hideLabel: true },
    items: [
      {
        bodyStyle: 'font-size: 12px; font-weight: bold;',
        html: 'Please enter your '+web_product_name+' email and password.'
      },{
        style: 'margin-top: 50px;',
        html: 'Email:'
      },{
        xtype: 'textfield',
        id: 'email',
        width: 200,
        enableKeyEvents: true,
        listeners: { 
          focus: function(){ Ext.getCmp('login-error').body.update('') },
          keydown: function(field,e){
            if (e.getKey() == e.ENTER)
            {
              loginForm.doSubmit()
            }
          }
        }
      },{
        style: 'margin-top: 10px;',
        html: 'Password:'
      },{
        xtype: 'textfield',
        id: 'password',
        width: 200,
        inputType: 'password',
        enableKeyEvents: true,
        listeners: { 
          focus: function(){ Ext.getCmp('login-error').body.update('') },
          keydown: function(field,e){
            if (e.getKey() == e.ENTER)
            {
              loginForm.doSubmit()
            }
          }
        }
      },{
        style: 'margin-top: 10px;',
        xtype: 'button',
        scale: 'medium',
        text: 'Login',
        width: 70,
        handler: function(){ loginForm.doSubmit() }
      },{
        id: 'login-error',
        style: 'margin-top: 15px;',
        bodyStyle: 'color: red;',
        height: 80
      },{
        html: 'Forgotten your password? <a href="http://'+web_product_domain+'/recover-password" target="_blank">Click here</a>'
      }
    ]
  }

  var loginPanel = new Ext.Panel({
    bodyStyle: 'padding: 20px;',
    layout: 'column',
    defaults: { border: false },
    items: [
      {
        columnWidth: .5,
        items: {
          border: false,
          bodyStyle: 'font-size: 12px; padding-top: 200px; padding-left: 40px;',
          html: "Don't have an account yet?<br/><a target=\"_blank\" href=\"http://"+web_product_domain+"/en/register\">Register now!</a>"
        }
      },{
        height: 450,
        style: 'border-left: 1px solid #BFBFBF;',
        columnWidth: .5,
        bodyStyle: 'padding-top: 100px; padding-left: 40px;',
        items: loginForm
      }
    ]
  });

  var wrapper = new Ext.Panel({
    height: 500,
    defaults: { border: false },
    border: false,
    items: {
      bodyStyle: 'color: gray; padding: 20px;',
      html: 'Loading...'
    },
    listeners: {
      render: function(){
        buttonStore.load({callback: function(){
          wrapper.removeAll();
          
          if (buttonStore.reader.jsonData.status == "200")
          {
            win.showBBar();
            buttonsList.renderButtons(languagesCombo.getValue());
            wrapper.add(buttonsPanel);
            vtStore.load();
          }
          else
          {
            wrapper.add(loginPanel);
          }
          
          wrapper.doLayout();
        }});
      }
    }
  });

  var win = new Ext.Window({
    width: 630,
    y: 30,
    x: 50,
    showBBar: function(){

      cultureStore.loadData(buttonStore.reader.jsonData.aval_cultures);
      
      if (!languagesCombo.getValue())
      {
        languagesCombo.setValue(dom_culture);
      }
      
      languagesCombo.show();
      alignCombo.show();
      Ext.getCmp('language-label').show();
      Ext.getCmp('align-label').show();
      Ext.getCmp('advanced-button').show();
    },
    title: web_product_name + ' settings',
    layout: 'fit',
    modal: true,
    resizable: false,
    items: wrapper,
    bbar: [
      {
        xtype: 'tbtext',
        hidden: true,
        text: 'Language:',
        id: 'language-label'
      },
        languagesCombo,
      {
        xtype: 'tbtext',
        hidden: true,
        style: 'margin-left: 20px;',
        text: 'Horizontal align:',
        id: 'align-label'
      },
        alignCombo,
      {
        id: 'advanced-button',
        hidden: true,
        style: 'margin-left: 20px;',
        xtype: 'button',
        text: 'Advanced',
        enableToggle: true,
        handler: function(button){
          
          var size = win.getSize();
          
          if (button.pressed)
          {
            win.setHeight(size.height + 110);
            
            wrapper.setHeight(610);
            
            advancedPanel.show();
          }
          else
          {
            win.setHeight(size.height - 110);
            
            wrapper.setHeight(500);
            
            advancedPanel.hide();
          }
        }
      },
      { xtype: 'tbfill' },
      {
        icon: proto+'://static.ssl7.net/images/disk.gif',
        text: 'Save',
        handler: function(){
          
          Ext.select('.widget').each(function(widget){
            
            if (widget.dom.id.match(widget_re))
            {
              var form = widget.child('form');
              
              if (form)
              {
                form.dom.submit();
                win.hide();
                return false;
              }
            }
          });
        }
      } 
    ]
  });
  
  win.show();

};
