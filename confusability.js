function genConfBlocks(rand_indices, num_trials, training) {
  let blocks = [],
      fav_func = function(){},
      num_blocks = 0;

  num_blocks = rand_indices.length;
  
  for (let block_i=0; block_i<num_blocks; block_i++) {
    let block = [],
        dist_alphabet = [];

    dist_alphabet = generateAlphabet();
    dist_alphabet = jsPsych.randomization.shuffle(dist_alphabet);  

    for (let trial_i=0; trial_i<num_trials; trial_i++) {
      fav_func = function() {
        let two_letters = [],
            distractor = '',
            html_display = '';
        
        if (training) {
          target = '#';
        }
        else {
          target = getTargets(rand_indices, training)[block_i];
        }
        
        //do not compare letter to itself
        if (dist_alphabet.includes(target)) {
          dist_alphabet.splice(dist_alphabet.indexOf(target), 1);
        }
        
        distractor = dist_alphabet[trial_i];
        
        if (Math.random() < .5) {
          two_letters = [target, distractor];
        }
        else {
          two_letters = [distractor, target];
        }
        
        html_display = '<div style="font-size:60px;">'+two_letters[0]+'&emsp;&emsp;'+two_letters[1]+'</div>';
        return html_display;
        }
        
      block.push({stimulus: fav_func});
    }
    //blocks becomes an array of arrays
    blocks.push(block);
  }
  return blocks
}

function genFeedback(num_blocks, num_trials, training=false) {
  let feedbacks = [],
      feedback_func = function() {};

  for (let i=0; i<num_blocks; i++) {
    feedback_func = function() {
      let correct_values = [],
          percentage_correct = 0,
          sum_correct = 0,
          feedback = '';

      correct_values = jsPsych.data.get().select('correct').values.slice(-num_trials);
      sum_correct = correct_values.reduce((partial_sum, a) => partial_sum + a, 0);
      percentage_correct = sum_correct / num_trials;
      if (!training) {
        feedback = `
              Sie haben den Zielbuchstaben in ${Math.round(100*percentage_correct)}% der Durchgänge dieses Blocks richtig erkannt.<br>
              Drücken Sie die rechte Pfeiltaste, um fortzufahren.
              `
      }
      else {
        feedback = `
              Sie haben das Zielzeichen in ${Math.round(100*percentage_correct)}% der Durchgänge dieses Blocks richtig erkannt.<br>
              Drücken Sie die rechte Pfeiltaste, um fortzufahren.
              `
      }
      
      return [feedback];
    }
    feedbacks.push(feedback_func);
  }
  return feedbacks
}

function genInstructs(rand_indices, training=false) {
  let target_instructs = [],
      instruct_func = function(){},
      num_blocks = 0;
  
  num_blocks = rand_indices.length;
  
  for (let i=0; i<num_blocks; i++) {
    instruct_func = function() {
      let instruct = ''
          target = '';

      target = getTargets(rand_indices, training)[i];
      if (training) {
        instruct = `
          Dieser erste Block ist ein Trainings-Block.
          Da dies noch nicht das eigentliche Experiment ist, haben wir als Ziel keinen Buchstaben, sondern ein Zeichen ausgewählt.<br>
          Das Zielzeichen für diese Runde ist <b>#</b>.<br>
          Drücken Sie bitte die rechte Pfeiltaste, wenn Sie bereit sind, mit dem Experiment fortzufahren.
          `
      }
      else {
        instruct = `
          Der Zielbuchstabe für diese Runde ist <b>${target}</b>.<br>
          Drücken Sie bitte die rechte Pfeiltaste, wenn Sie bereit sind, mit dem Experiment fortzufahren.
          `
      }

      return [instruct]; 
    }
    target_instructs.push(instruct_func);
  }
  return target_instructs
}

function generateAlphabet() {
    let alphabet = [];
    let start = 'A'.charCodeAt(0);
    let last  = 'Z'.charCodeAt(0);
    for (let i = start; i <= last; i++) {
      alphabet.push(String.fromCharCode(i));
    }
  return alphabet;
}

function getTargets(rand_indices, training=false) {
  let target_arr = [],
      num_blocks = 0,
      num_exp_stim = 0,
      obj = {},
      fore = '',
      subj_code = '',
      sur = '';
  
  num_blocks = rand_indices.length;
  
  json_arr = jsPsych.data.get().filter({trial_type: 'survey-text'}).select('responses').values; 
  for (const json of json_arr) {
    obj = JSON.parse(json);
    if ('subj_code' in obj){
      subj_code = obj.subj_code;
    }
  }

  fore = subj_code[0];
  sur = subj_code.slice(-1);
  if (fore === sur) {
    target_arr[0] = fore;
  }
  else {
    target_arr[0] = fore;
    target_arr[1] = sur;
  }

  //select the first four elements of the randomizer
  randomizer_slice = dist_randomizer.slice(0, num_blocks);
  //check whether target is in slice and remove it if necessary
  for (const letter of [fore, sur]){
    if (randomizer_slice.includes(letter)){
      let i = randomizer_slice.indexOf(letter);
      randomizer_slice.splice(i, 1);
    }
  }

  num_exp_stim = target_arr.length;
  //if fore===sure fill up num_blocks-1 random controls, else num_blocks-2
  for (let control_i = 0; control_i < num_blocks-num_exp_stim; control_i++) {
    //two blocks are already filled with the 'real' targets, hence we need to fill 2 less
    target_arr[num_exp_stim+control_i] = randomizer_slice[control_i]
  }
  
  let rand_targets = [];

  for (const i of rand_indices) {
    rand_targets.push(target_arr[i]);
  }

  if (training) {
    rand_targets = ['#'];
  }

  console.log('target_arr before return:', rand_targets);

  return rand_targets;
}

function saveData(fname, data){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({filename: fname, filedata: data}));
}