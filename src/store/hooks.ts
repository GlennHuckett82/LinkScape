import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/** Typed dispatch hook for Redux Toolkit thunks and actions. */
export const useAppDispatch: () => AppDispatch = useDispatch;
/** Typed selector hook to get strongly-typed slices of state. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
