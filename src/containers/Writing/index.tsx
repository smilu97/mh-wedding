import React, { useCallback, useRef } from 'react';
import { styled } from '../../stitches';
import { useNavigate } from 'react-router-dom';
import useGuestBook, { Comment } from '../../guestbook';
import { extractFromForm, useCancel } from '../../util';

import PageTitle from '../../components/PageTitle';

const RootContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '5rem auto',
});

const ContentWrap = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '28rem',
  padding: '2.5rem 1.5rem 2.5rem 1.5rem',
  boxSizing: 'border-box',
});

const InputWrap = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: '1rem',
});

const InputTitle = styled('h2', {
  marginBottom: '4px',
  fontSize: '0.875rem',
  fontWeight: '400',
  fontFamily: 'Nanum Square',
  letterSpacing: '0.1rem',
  color: '#998F7C',
});

const InputBox = styled('input', {
  padding: '1rem',
  width: '100%',
  height: '3rem',
  border: 'solid 1px $primary150',
  borderRadius: '1rem',
  outline: 'none',
  fontSize: '0.875rem',
  fontWeight: '400',
  fontFamily: 'Nanum Square',
  color: '$primary400',
  boxSizing: 'border-box',

  '&::placeholder': {
    fontSize: '0.875rem',
    fontWeight: '400',
    color: '$primary200',
  },
});

const TextArea = styled('textarea', {
  padding: '1rem',
  width: '100%',
  height: '9rem',
  border: 'solid 1px $primary150',
  borderRadius: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'none',

  '&::placeholder': {
    fontSize: '0.875rem',
    fontWeight: '400',
    fontFamily: 'Nanum Square',
    color: '$primary200',
  },
});

const RadioContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'cneter',
  padding: '1rem 0',
  width: '100%',
});

const RadioWrap = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'cneter',
  width: '50%',
});

const Radio = styled('input', {
  appearance: 'none',
  verticalAlign: 'middle',
  marginRight: '1rem',
  width: '1.55rem',
  height: '1.55rem',
  border: 'max(2px, 0.2rem) solid $primary400',
  borderRadius: '1rem',
  backgroundColor: '#ffffff',

  '&:checked': {
    backgroundColor: '$primary400',
  },
});

const Label = styled('label', {
  position: 'relative',
  top: '2px',
  fontSize: '0.875rem',
  fontWeight: '600',
  fontFamily: 'Nanum Square',
  color: '$primary400',
});

const ButtonWrap = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '6rem',
  width: '100%',
});

const Button = styled('input', {
  width: 'calc(50% - 6px)',
  height: '3.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  fontFamily: 'Nanum Square',
  borderRadius: '1rem',
  border: 'none',
  variants: {
    bg: {
      1: { backgroundColor: '$primary400', color: '#ffffff' },
      2: { backgroundColor: '$primary150', color: '$primary400' },
    },
  },
});

export default function Writing() {
  const navigate = useNavigate();
  const cancel = useCancel('/guestbook');
  const add = useGuestBook()[1];
  const lastSubmitTime = useRef(0);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      {
        const now = Date.now();
        if (now <= lastSubmitTime.current + 10000) {
          return;
        }
        lastSubmitTime.current = now;
      }
      const el = e.currentTarget;
      let comment: Comment | undefined = undefined;

      try {
        const data = new FormData(el);

        const nickname = extractFromForm(data, 'nickname');
        const message = extractFromForm(data, 'message');
        const password = extractFromForm(data, 'password');
        const willAttend = extractFromForm(data, 'willAttend');
        comment = {
          id: -1,
          timestamp: Date.now(),
          nickname,
          message,
          password,
          willAttend: willAttend === 'true',
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        console.log(comment);
        if (comment) {
          add(comment).then(() => navigate('/guestbook'));
        }
      }
    },
    [add, navigate]
  );

  return (
    <RootContainer>
      <PageTitle>Writing</PageTitle>
      <ContentWrap>
        <form onSubmit={handleSubmit}>
          <InputWrap>
            <InputTitle>??????</InputTitle>
            <InputBox name="nickname" placeholder="????????? ??????????????????" />
          </InputWrap>
          <InputWrap>
            <InputTitle>?????????</InputTitle>
            <TextArea name="message" placeholder="???????????? ??????????????????" />
          </InputWrap>
          <InputWrap>
            <InputTitle>????????????</InputTitle>
            <RadioContainer>
              <RadioWrap>
                <Radio
                  type="radio"
                  id="attendTrue"
                  name="willAttend"
                  value="true"
                />
                <Label htmlFor="attendTrue">?????? ??????</Label>
              </RadioWrap>
              <RadioWrap>
                <Radio
                  type="radio"
                  id="attendFalse"
                  name="willAttend"
                  value="false"
                  defaultChecked
                />
                <Label htmlFor="attendFalse">?????? ??????</Label>
              </RadioWrap>
            </RadioContainer>
          </InputWrap>
          <InputWrap>
            <InputTitle>????????? ????????????</InputTitle>
            <InputBox
              type="password"
              name="password"
              placeholder="????????? ??????????????? ??????????????????"
            />
          </InputWrap>
          <ButtonWrap>
            <Button type="submit" value="??????" bg={2} onClick={cancel} />
            <Button type="submit" value="??????" bg={1} />
          </ButtonWrap>
        </form>
      </ContentWrap>
    </RootContainer>
  );
}
