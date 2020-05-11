import React from 'react';
// import { Mutation, FetchResult, MutationFn } from 'react-apollo';
import { FormError } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import QuizView from '../components/QuizView';
import { graphql } from 'react-apollo';
import { compose } from '@gqlapp/core-common';
import { message } from 'antd';

// import CONTACT from '../graphql/Quiz.graphql';
// import { QuizForm } from '../types';
import ADD_ANSWER from '../graphql/AddAnswers.graphql';
import QUIZ_QUERY from '../graphql/QuizQuery.graphql';
import CURRENT_USER_QUERY from '@gqlapp/user-client-react/graphql/CurrentUserQuery.graphql';


const Quiz = (props) => {
  const onSubmit =  async (values) => {
    const { t, addAnswer, quiz, quizLoading } = props; 
    try {
      await addAnswer(values);
      message.destroy();
          message.success('Answers Submitted');
    } catch (e) {
      message.destroy();
          message.error("Couldn't perform the action");
      throw new FormError(t('serverError'), e);
    }
  };
  console.log('quiz', props);
  return (
    
     <QuizView {...props} onSubmit={onSubmit} />
      
  );
};

export default compose(
  graphql(ADD_ANSWER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addAnswer: async values => {
        message.destroy();
        message.loading('Please wait...', 0);
        try {
          let ansData = await mutate({
            variables: {
              input: values
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addAnswer: {
                __typename: 'Quiz',
                ...values
              }
            }
          });

          
        } catch (e) {
          
          console.error(e);
        }
      }
    })
  }),
  graphql(CURRENT_USER_QUERY, {
    props({ data: { loading, error, currentUser } }) {
      if (error) throw new Error(error);
      return { currentUserLoading:loading, currentUser };
    }
  }),
  graphql(QUIZ_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id: Number(id) }
      };
    },
    props({ data: { loading, error, quiz } }) {
      if (error) throw new Error(error);
      return { quizLoading: loading, quiz };
    }
  }),
  )(translate('contact')(Quiz));
