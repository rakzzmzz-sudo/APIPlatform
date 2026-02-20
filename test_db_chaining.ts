import { db } from './src/lib/db.js'; // Note .js extension for TS node running

async function runTests() {
  console.log('Testing AppDbClient Chaining...');
  
  try {
    // Test 1: Simple select (control)
    console.log('\n--- Test 1: SELECT ---');
    const res1 = await db.from('products').select('*').limit(1);
    console.log('Results:', !!res1?.data, 'Error:', res1?.error);

    // Test 2: Update chaining
    // Note: We use a known table and fake condition so we don't break the DB
    console.log('\n--- Test 2: UPDATE Chaining ---');
    console.log('Executing: db.from("products").update({ status: "test" }).eq("id", "invalid-id")');
    const updateQuery = db.from('products').update({ status: 'test' }).eq('id', 'invalid-id');
    
    // Check if it's a valid chainable object before awaiting
    if (typeof updateQuery.then !== 'function') {
      console.error('❌ FAIL: update() did not return a thenable object!');
    } else {
      const res2 = await updateQuery;
      console.log('✅ SUCCESS: update() is thenable and executed successfully.');
      console.log('Response Error:', res2?.error); // Should be null or valid DB error, NOT a TypeError
    }

    // Test 3: Insert chaining
    console.log('\n--- Test 3: INSERT Chaining ---');
    const res3 = await db.from('cart_items').insert({ 
      user_id: 'test', 
      item_type: 'test', 
      quantity: 1, 
      unit_price: 0, 
      total_price: 0 
    });
    console.log('Insert Result:', !!res3?.data, 'Error:', res3?.error);
    
    // Cleanup the test insert
    if (res3?.data) {
      const insertedId = Array.isArray(res3.data) ? res3.data[0].id : res3.data.id;
      if (insertedId) {
        console.log(`Cleaning up test insert (id: ${insertedId})...`);
        const delRes = await db.from('cart_items').delete().eq('id', insertedId);
        console.log('Cleanup Result:', !delRes?.error);
      }
    }

  } catch (error) {
    console.error('Test script crashed!', error);
    process.exit(1);
  }
}

runTests();
