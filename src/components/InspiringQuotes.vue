<template>
  <div class="inspiring_quotes_container">
    <div v-if="quote" class="tso_blackcard">
      {{quote.quote}}
      <span>Author: {{quote.author}}</span>
    </div>
    <div
      class="light-text"
      style="text-decoration: none; color:#ccc; z-index: 999; text-align: right; padding-right: 20px; margin-top: 5px;"
    >
      <a
        style="text-decoration: none; color:#ccc;"
        title="Inspiring Quote of the day"
        href="https://theysaidso.com/quote-of-the-day/inspire"
      >They Said So</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "InspiringQuotes",
  data() {
    return {
      quote: ""
    };
  },
  mounted() {
    if (this.$cookies.isKey("quote")) this.quote = this.$cookies.get("quote");
    else {
      console.log("Making the request");
      axios
        .get("https://quotes.rest/qod.json?category=inspire")
        .then(response => {
          this.quote = response.data.contents.quotes[0];
          this.$cookies.set("quote", this.quote, "1d");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
.inspiring_quotes_container {
  width: 70%;
  margin-top: auto;
  margin-bottom: 5rem;
  margin-left: 5rem;
}
</style>
