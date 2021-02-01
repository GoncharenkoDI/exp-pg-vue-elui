<template>
  <div>
    cccccccccccccccccc Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Quas repellat nam sit quae magnam. Voluptate, magnam praesentium omnis
    maxime, animi modi expedita eos atque, tempore totam recusandae. Voluptates,
    voluptatibus! Voluptates delectus optio iure nobis minima odio,
    reprehenderit fugit sed maiores non cum possimus veniam? Doloremque nisi
    laudantium dolore ex eveniet magni, facere doloribus quae officiis minima,
    recusandae tempora veniam animi rerum cumque ut blanditiis non nihil neque
    praesentium. Saepe sint, atque voluptatem nihil perferendis beatae
    laboriosam ipsam at magni est mollitia, quaerat minima quam quia non!
    Reprehenderit omnis blanditiis cumque est sapiente ea quod, nobis eius
    facere recusandae voluptas consequuntur dolor, atque molestias distinctio
    officiis harum qui eos ratione possimus. Voluptatibus iusto quod libero
    alias ducimus magnam possimus, deserunt voluptate hic? Voluptas, porro
    temporibus labore officia quae quam odit eum soluta maiores deleniti alias
    perferendis distinctio non reiciendis et tempore magni ipsum, tenetur nemo
    sed accusantium pariatur! Quia reprehenderit voluptate esse quas,
    perferendis, ipsa unde at laborum voluptas fugiat repudiandae architecto
    voluptatem! Nulla libero dignissimos minus quia mollitia, voluptatum
    praesentium nisi ab vero velit dolores ullam enim officiis provident,
    numquam adipisci explicabo, nesciunt quasi veritatis. Dicta non similique
    laborum. Ipsam dolores esse voluptatibus illo ducimus recusandae repellendus
    fugit nulla perferendis fuga molestiae quos temporibus quo, aperiam animi
    facere magnam voluptatem laudantium ab earum ipsa? Omnis deleniti cumque
    doloribus. Delectus sint minima, veritatis molestias amet velit animi neque
    tenetur inventore vero ea quasi, magnam eos? Voluptatum expedita at eveniet
    voluptate minima et? Officiis impedit vero minima saepe quae tempore fugiat
    totam suscipit optio accusantium animi, repudiandae delectus voluptatibus
    quibusdam illum sapiente facilis. Voluptate esse iste ab corporis quas,
    expedita explicabo aperiam, sapiente dolor eius consequuntur delectus error
    perferendis laborum quidem eligendi ut id aliquam ad adipisci deleniti?
    Recusandae consequatur nostrum nam aperiam architecto perferendis modi est
    reprehenderit quos doloribus. Itaque, ullam.
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
    return {
      tableData: [item]
    }
  },
  async mounted() {
    const fp = await (await this.$fingerprint).get()
    console.log(fp.visitorId)
  }
}
</script>
