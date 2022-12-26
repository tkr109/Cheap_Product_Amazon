const puppeteer = require('puppeteer');

var express = require('express');  
var app = express();  

var bodyParser=require("body-parser");

var nodemailer = require('nodemailer');

require('dotenv').config()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

const email=process.env.EMAIL;
const password=process.env.PASSWORD;


app.get('/',function(req,res){
    res.redirect('/form.html');
})


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });

var product; 
var user_email;
app.post('/',async function(req,res){
     product=req.body.product_name;
     user_email=req.body.user_email;
     delay(2000);
    await console.log(product);
    await run()
    await console.log("sending")
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);

        }
    });

    await res.redirect('/output.html');
})

var mailOptions = {
    from: email,
    to: email,
    subject: 'Cheapest Product Scanned',
    text: 'Please Find Attachment',
    attachments:[
        {filename:'final.png', path:'./final.png'}
    ]
  };
  

const selectors={
    searchBox:'#twotabsearchtextbox',
    searchButton:'#nav-search-submit-button',
    nextSection:'.a-section a-text-center s-pagination-container',
    sort:'#s-result-sort-select',
    sort_low:'#s-result-sort-select_1'
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function run()
{
    const browser=await puppeteer.launch({defaultViewport: null,});
    const page =await browser.newPage();
    await page.goto("https://amazon.in/");
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    await page.type(selectors.searchBox,product);
    await page.click(selectors.searchButton);
    await delay(2000);
    await page.waitForSelector(selectors.sort);
    await page.click(selectors.sort);
    await page.waitForSelector(selectors.sort_low);
    await page.waitForSelector(selectors.sort_low);
    await page.click(selectors.sort_low);
    await delay(2000);
    await page.screenshot({path: 'final.png'})
    await browser.close();
}

app.listen(3000,function(req){
    console.log("Server Started");
})
